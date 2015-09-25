# Git Help - Contribute

First setup the frappe app as described in the app's README. 

For example, to contribute to manual, follow this [README][1] to setup frappe / manual\_erpnext\_com. 

Once everything is setup, sign in to github.com with your account and [fork][2] the manual\_erpnext\_com repository.  

Now, change to the app directory.

    cd ~/frappe-bench/apps/manual_erpnext_com  

Add your repository remote (the forked repository). 

    git remote add origin https://github.com/<github_username>/manual_erpnext_com.git  
    git pull origin master  

Then switch to origin/master instead of upstream/master branch.

    git branch master --set-upstream-to origin/master  
    git checkout master  
   
By doing this, all the changes you make will be done on pulled forked repository.  

Continue adding or editing pages as mentioned in [README][1].  
  
Push changes with following commands:  
  
    git add .  
    git commit -a  
  
Enter comment, press Ctrl + X to close nano, press 'Y' and Enter to confirm saving file  

    git push  
  
Once the changes are pushed, create [pull request][3] by signing in with your username on github.  
  
Keep your fork synced with upstream repository.  

[Git Help - Sync my repo (frappe fork) to latest frappe repo][4] in brief:  

  
    git pull --rebase upstream master  

Keep add to the same pull request or create separate branches on your repository and create pull requests.  
Read more [Git Help - Open Pull request][5]  

  [1]:https://github.com/frappe/manual_erpnext_com/blob/master/README.md
  [2]:https://help.github.com/articles/fork-a-repo/#fork-an-example-repository
  [3]:https://help.github.com/articles/creating-a-pull-request/
  [4]:https://discuss.erpnext.com/t/git-help-sync-my-repo-frappe-fork-to-latest-frappe-repo/7061
  [5]:https://discuss.erpnext.com/t/git-help-open-pull-request/7520