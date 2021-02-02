const { events, Job, Group } = require("brigadier");
events.on("push", async (e, project) => {
  var job = new Job("my-firstjob", "amitsanu/brigadeimage1:latest");
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
    "echo helm installed ",
    
  ];
  // const lint = new Job("my-lint","amitsanu/brigimage1:latest");
  //   lint.privileged = true;
  //   lint.tasks = [
  //     "cd /src",
  //     "npm i",
  //     "helm lint",
  //     "echo lint done sucessfully"
  // ];

  const job2 = new Job("my-docker","amitsanu/brigimagef:latest");
  job2.privileged = true;
  job2.env = {
    DOCKER_DRIVER: "overlay"
  };
  job2.tasks = [
    // docker image pushing to gcp
    "dockerd &",
    "dockerd-entrypoint.sh &",
    "gcloud auth configure-docker",
    "docker version",
    "docker images",
    "cd /src",
    "ls",
    "docker build -t mydocker:latest .",
    "docker tag mydocker:latest gcr.io/vocal-raceway-299310/mydocker:v1",
    "gcloud docker push gcr.io/vocal-raceway-299310/mydocker:v1",
    "echo docker image pushed"
  ];

  job.run();
  // lint.run();
  job2.run();
});
