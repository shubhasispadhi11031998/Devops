let { events, Job } = require("brigadier");
events.on("push", async (e, project) => {
  let job = new Job("my-firstjob", "amitsanu/brigimagef:latest");
  job.privileged = true;
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

    // docker image pushing to gcp
    // "apk add --update --no-cache make git",
    // "dockerd-entrypoint.sh &",
    // "sleep 10",
    // "cd /src",
    // "ls",
    // "docker version",
    // "docker ps",
    // "docker build -t mydocker:latest .",
    // "docker tag mydocker:latest gcr.io/vocal-raceway-299310/mydocker:v1",
    // "docker push gcr.io/vocal-raceway-299310/mydocker:v1",
    // "echo docker image pushed",
  ]
  const helmjob = new Job("my-helm", "amitsanu/brigadeimage1:latest");
  helmjob.tasks = [
    //helm authentication
    "gcloud auth activate-service-account --key-file=key.json",
    `gcloud container clusters get-credentials cluster-1 --zone us-central1-c --project ${keyval.project_id}`,
    "gcloud components install kubectl",
    "echo cluster done setup",
    "helm version",
    "helm repo add stable https://charts.helm.sh/stable",
    "echo repo added",
    "helm repo update",
    "helm list",
    "echo helm installed ",
  ]
  const lint = new Job("my-lint", "node:alpine");
  lint.tasks = [
    //linting job 
    "cd /src",
    "npm i",
    "npm run lint",
    "echo lint done successfully"
  ]

  //git versoning
  // let jobgit = new Job("my-gittask","amitsanu/brigimagef:latest") ;
  //   jobgit.tasks = [
  //     "cd /src",
  //     "echo https://shubhasispadhi11031998:11sub11@@github.com",
  //     "git config credential.helper 'store --file .git-credentials'",
  //     "git remote add origin https://github.com/shubhasispadhi11031998/Devops.git",
  //     "echo git auth done",
  //     "wget -q -O gitversion https://github.com/screwdriver-cd/gitversion/releases/download/v1.1.1/gitversion_linux_amd64",
  //     "chmod u+x ./gitversion",
  //     "git fetch --tags -q",
  //     "/gitversion  bump auto && ./gitversion show > pipeline_app_version.txt",
  //     "git branch",
  //     "git push --tags origin",
  //     // "latestTag=$(git describe --tags `git rev-list --tags --max-count=1`)",
  //     // "echo $latestTag",
  //     "echo versoining done..."
  // ]
  job.run();
  helmjob.run();
  // jobgit.run();
  lint.run();
});
