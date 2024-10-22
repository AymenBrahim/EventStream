FROM python:3.11.3-slim-buster
ENV PROJECT_ROOT=/srv/app
WORKDIR $PROJECT_ROOT
# Set env variables


# Install necessary soft
RUN apt-get update \
    && apt-get install -y netcat curl git make gcc postgresql python3-dev libpq-dev\
    && apt-get clean 

# Copy & install dependencies
COPY ./requirements ./requirements
RUN pip install -r ./requirements/dev.txt

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=$WORKDIR
ENV PATH="$PATH:$PYTHONPATH"

RUN useradd -ms /bin/bash user
USER user

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]