FROM python:3.7
RUN apt-get update

COPY requirements.txt requirements.txt
RUN python -m venv /usr/local/env
ENV PATH=/usr/local/env/bin:$PATH
RUN pip install -r requirements.txt

WORKDIR /whoopiepie

ENTRYPOINT ["gunicorn",\
     "--worker-tmp-dir",\
     "/dev/shm",\
     "--workers",\
     "2",\
     "--threads",\
     "4",\
     "--worker-class",\
     "gthread",\
     "-b",\
     "0.0.0.0:8000",\
     "--log-file",\
     "/gunicorn_log.log",\
     "--log-level",\
     "debug",\
     "--reload",\
     "downloader.wsgi"]
