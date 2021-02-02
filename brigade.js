const { events, Job } = require("brigadier");
events.on("push", async (e, project) => {
  var job = new Job("my-firstjob", "amitsanu/brigimage1:latest");
  job.priviliged = true;
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
    //authentication with gcloud
    "echo now auth",
    "gcloud version",
    "echo $key > key.json",
    "cat key.json",
    "gcloud auth activate-service-account --key-file=key.json",
    "gcloud config set project vocal-raceway-299310",
    "echo auth gcloud done",


    // helm authentication
    `gcloud container clusters get-credentials cluster-1 --zone us-central1-c --project ${keyval.project_id}`,
    "gcloud components install kubectl",
    "echo cluster done setup",
    "helm version",
    "helm repo add stable https://charts.helm.sh/stable",
    "echo repo added",
    "helm repo update",
    "helm list",
    "echo helm installed ",
    
    // docker image pushing to gcp
    // "docker version",
    // "cd /src",
    // "ls",
    // "docker build -t mydocker:latest .",
    // "docker tag mydocker:latest gcr.io/vocal-raceway-299310/mydocker:v1",
    // "docker push gcr.io/vocal-raceway-299310/mydocker:v1",
    // "echo docker image pushed"
    
      "cd /src",
      "npm i",
      "npm install npm-package-json-lint",
      "echo lint done sucessfully"
  ];

  job.run();
  lint.run();
});
