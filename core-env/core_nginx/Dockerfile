FROM nginx:1.23

COPY ./web_build/ /var/www/core/web_build/
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx /var/www/core
WORKDIR /etc/nginx
RUN rm conf.d/default.conf && chown -R nginx:nginx /var/www/core
RUN sed -i 's/^user/#user/' /etc/nginx/nginx.conf
