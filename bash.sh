git checkout web4hub-patch-1
# or: git checkout main
# apply the above changes
git add .github/workflows/webpack.yml src/github/client.js
git commit -m "Fix CI build and GitHub client pagination"
git push origin web4hub-patch-1
git clone https://github.com/web4hub/web4-publisher.git
cd web4-publisher
find . -maxdepth 3 -type f | sort
