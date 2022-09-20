// The Deliverables are ambiguous
// "dispaly information about the users .. might include ... username, avatar and a link to their profile"
// "Clicking on one of these users ... return data about ... repositories"
// Does "Clicking on ... users" meaning clicking on the "username"?
// Or maybe any part of the "information" from the search?
// Making the username and/or avatar elements "return data" is understandable
// But making a link do anything but open / navigate to that link would be unexpected
// Further, it looks like the provide "user-list" in index.html is where user data should be displayed
// And it looks like the "repos-list" below "user-list" is where user's repos should be displayed
// Will have User shows in "user-list"
// Will have username and avatar clickable for Repos
// Will have link to profile be normal hyperlink to profile
// Will have Repos show in "repos-list"
// Will assume users know clicking username/avatar shows repos
// Will display repos similar to https://github.com/somethingfly?tab=repositories
// Will assume clearing list after each search / retrieval
// Will use a heading of search term / retrieval term
// Will do the Bonus later if I have time

const gitUrl = "https://api.github.com";

document.addEventListener("DOMContentLoaded", () => {
  const githubForm = document.getElementById("github-form");
  githubForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const githubSearch = githubForm.elements["search"].value;
    const gitUrlSearch = gitUrl + "/search/users?q=" + githubSearch;
    fetch(gitUrlSearch, {
      method: "GET",
      headers: {
        "Accept": "application/vnd.github.v3+json"
      }
    })
      .then((resp) => resp.json())
      .then((users) => renderUsers(users,githubSearch));
  });
});

function renderUsers(users,githubSearch) {
  const userList = document.getElementById("user-list");
  while (userList.firstChild) {
    userList.removeChild(userList.firstChild);
  };
  const li = document.createElement("li");
  const div = document.createElement("div");
  const h1 = document.createElement("h1");
  userList.appendChild(li);
  li.appendChild(div);
  div.style.textAlign = "center";
  div.style.paddingBottom = "25px";
  div.appendChild(h1);
  h1.innerText = githubSearch;
  users.items.forEach(user => {renderUser(user.login,user.avatar_url,user.url)});
}

function renderUser(userLogin,userAvatarUrl,userUrl) {
  const userList = document.getElementById("user-list");
  const li = document.createElement("li");
  const div = document.createElement("div");
  const h2 = document.createElement("h2");
  const img = document.createElement("img");
  const p = document.createElement("p");
  const a = document.createElement("a");
  const link = document.createTextNode("Profile"); 
  userList.appendChild(li);
  li.appendChild(div);
  div.style.textAlign = "center";
  div.style.paddingBottom = "25px";
  div.appendChild(h2);
  h2.innerText = userLogin;
  h2.classList.add(userLogin);
  div.appendChild(img);
  img.src = userAvatarUrl;
  img.style.height = "200px";
  img.style.width = "200px";
  img.classList.add(userLogin);
  div.appendChild(p);
  p.appendChild(a);
  a.appendChild(link);
  a.title = "Profile";
  a.href = userUrl;
  h2.addEventListener("click",fetchRepos);
  img.addEventListener("click",fetchRepos);
}

function fetchRepos() {
  const userLogin = this.className;
  const gitUrlRepos = gitUrl + "/users/" + userLogin + "/repos";
  fetch(gitUrlRepos, {
    method: "GET",
    headers: {
      "Accept": "application/vnd.github.v3+json"
    }
  })
    .then((resp) => resp.json())
    .then((repos) => renderRepos(repos,userLogin));
}

function renderRepos(repos,userLogin) {
  const reposList = document.getElementById("repos-list");
  while (reposList.firstChild) {
    reposList.removeChild(reposList.firstChild);
  };
  const li = document.createElement("li");
  const div = document.createElement("div");
  const h2 = document.createElement("h2");
  reposList.appendChild(li);
  li.appendChild(div);
  div.style.textAlign = "center";
  div.style.paddingBottom = "25px";
  div.appendChild(h2);
  h2.innerText = userLogin;
  repos.forEach(repo => {renderRepo(repo.name,repo.private,repo.html_url,repo.fork,repo.description)});
}

function renderRepo(repoName,repoPrivate,repoHtmlUrl,repoFork,repoDescription){
  const reposList = document.getElementById("repos-list");
  const li = document.createElement("li");
  const div = document.createElement("div");
  const h3 = document.createElement("h3");
  const a = document.createElement("a");
  const link = document.createTextNode(repoName);
  const span1 = document.createElement("span");
  const p = document.createElement("p");
  reposList.appendChild(li);
  li.appendChild(div);
  div.style.textAlign = "center";
  div.style.paddingBottom = "25px";
  div.appendChild(h3);
  h3.appendChild(a);
  a.appendChild(link);
  a.title = repoName;
  a.href = repoHtmlUrl;
  h3.appendChild(span1);
  if (repoPrivate) {
    span1.innerText = " (Private)";
  } else {
    span1.innerText = " (Public)";
  };
  if (repoFork) {
    const span2 = document.createElement("span");
    h3.appendChild(span2);
    span2.innerText = " (Forked)";
  };
  div.appendChild(p);
  p.innerText = repoDescription;
}