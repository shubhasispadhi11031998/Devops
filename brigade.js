let { events, Job } = require("brigadier");

events.on("push", async (e, project) => {
  let job = new Job("my-firstjob", "anuj2112/ajdocker:d1");
  job.priviliged = true;
  job.docker.enabled = true;
  let keyval = {
    type: project.secrets.type,
    project_id: project.secrets.project_id,
    private_key_id: project.secrets.private_key_id,
    private_key: project.secrets.private_key,
    client_email: project.secrets.client_email,
    client_id: project.secrets.client_id,
    auth_uri: project.secrets.auth_uri,
    token_uri: project.secrets.token_uri,
    auth_provider_x509_cert_url: project.secrets.auth_provider_x509_cert_url,
    client_x509_cert_url: project.secrets.client_x509_cert_url,
  };
  let keyvalobj = JSON.stringify(keyval);
  job.env = {
    DOCKER_DRIVER: "overlay",
    key: keyvalobj
  }
  job.tasks = [
    "apk add --update --no-cache make git",
    "dockerd-entrypoint.sh &",
    "sleep 20",
    "cd /src",
    "docker version &",
    "docker ps",
    "docker build -f Dockerfile -t nodedoc:v2 .",
    "docker images",
    "echo image build successfully..."
    //authentication with gcloud
    // "echo now auth",
    // "gcloud version",
    // "echo $key > key.json",
    // "cat key.json",
    // "gcloud auth activate-service-account --key-file=key.json",
    // "gcloud config set project vocal-raceway-299310",
    // "echo auth gcloud done",

    // docker image pushing to gcp
    // "echo now auth",
    // "echo $key > key.json",
    // "gcloud auth activate-service-account --key-file=key.json",
    // "echo auth gcloud done",
    // "apk add --update --no-cache make git",
    // "dockerd-entrypoint.sh &",
    // "dockerd &",
    // "sleep 10",
    // "cd /src",
    // "ls",
    // // "docker ps",
    // "docker build -t mydocker:latest .",
    // "docker tag mydocker:latest gcr.io/vocal-raceway-299310/mydocker:v1",
    // "docker push gcr.io/vocal-raceway-299310/mydocker:v1",
    // "echo docker image pushed"
  ];
  // job.run();
});
