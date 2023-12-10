FROM maven:3-openjdk-17 AS mvn
WORKDIR /tmp
COPY ./pom.xml /tmp/streetcleaning/pom.xml
COPY ./src /tmp/streetcleaning/src
WORKDIR /tmp/streetcleaning
RUN mvn clean install -Dmaven.test.skip=true

FROM openjdk:17-jdk-slim
ENV FOLDER=/tmp/streetcleaning/target
ENV APP=streetcleaning-1.0.0.jar
ARG USER=streetcleaning
ARG USER_ID=3004
ARG USER_GROUP=streetcleaning
ARG USER_GROUP_ID=3004
ARG USER_HOME=/home/${USER}

RUN  addgroup -g ${USER_GROUP_ID} ${USER_GROUP}; \
     adduser -u ${USER_ID} -D -g '' -h ${USER_HOME} -G ${USER_GROUP} ${USER} ;

WORKDIR  /home/${USER}/app
# RUN chown ${USER}:${USER_GROUP} /home/${USER}/app
COPY --from=mvn --chown=streetcleaning:streetcleaning ${FOLDER}/${APP} /home/${USER}/app/streetcleaning.jar

# USER streetcleaning
CMD ["java", "-jar", "streetcleaning.jar"]