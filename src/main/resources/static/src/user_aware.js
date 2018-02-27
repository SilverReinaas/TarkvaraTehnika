export class UserAware {

    get loggedInUsername(){
        return localStorage.getItem("currentUser");
    }

}