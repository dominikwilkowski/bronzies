# NGINX CONFIG FOR BRONZIES.COM
#


# http to https redirect
#
server {
	server_name  www.bronzies.com bronzies.com;
	root         /var/www/html/bronzies;
	return 301   https://bronzies.com$request_uri;
}


# www to https redirect
#
server {
	listen       443 ssl;
	listen       [::]:443 ssl;
	server_name  www.bronzies.com;

	ssl on;
	ssl_certificate            /etc/letsencrypt/live/bronzies.com/fullchain.pem;
	ssl_certificate_key        /etc/letsencrypt/live/bronzies.com/privkey.pem;
	ssl_session_timeout        1d;
	ssl_session_cache          shared:SSL:50m;
	ssl_session_tickets        off;
	ssl_protocols              TLSv1 TLSv1.1 TLSv1.2;
	ssl_prefer_server_ciphers  on;
	ssl_dhparam                /etc/nginx/ssl/dhparam.pem;
	ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256';  #generate here: https://mozilla.github.io/server-side-tls/ssl-config-generator/
	ssl_stapling               on;
	ssl_stapling_verify        on;

	location ~ /\.ht {
		deny  all;
	}

	return 301  https://bronzies.com$request_uri;
}


# ssl and http2 config
#
server {
	listen       443 ssl http2;
	listen       [::]:443 ssl http2;
	server_name  bronzies.com;
	root         /var/www/html/bronzies;
	index        index.html;

	ssl on;
	ssl_certificate      /etc/letsencrypt/live/bronzies.com/fullchain.pem;
	ssl_certificate_key  /etc/letsencrypt/live/bronzies.com/privkey.pem;

	ssl_session_timeout  1d;
	ssl_session_cache    shared:SSL:50m;
	ssl_session_tickets  off;

	ssl_protocols              TLSv1 TLSv1.1 TLSv1.2;
	ssl_prefer_server_ciphers  on;
	ssl_dhparam                /etc/nginx/ssl/dhparam.pem;
	ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256';  #generate here: https://mozilla.github.io/server-side-tls/ssl-config-generator/

	# OCSP Stapling ---
	# fetch OCSP records from URL in ssl_certificate and cache them
	ssl_stapling         on;
	ssl_stapling_verify  on;

	# root server
	#
	location / {
		try_files $uri /index.html;
	}


	# deny access to .htaccess files, if Apache's document root
	# concurs with nginx's one
	#
	location ~ /\.ht {
		deny  all;
	}


	# NodeJS proxy
	#
	location /api/ {
		proxy_redirect          off;
		proxy_pass_header       Server;
		proxy_set_header        X-Real-IP $remote_addr;
		proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header        X-Scheme $scheme;
		proxy_set_header        Host $http_host;
		proxy_set_header        X-NginX-Proxy true;
		proxy_connect_timeout   5;
		proxy_read_timeout      240;
		proxy_intercept_errors  on;

		proxy_pass              http://127.0.0.1:5555;
	}
}
