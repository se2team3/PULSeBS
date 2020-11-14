class User{
    constructor(id,university_id,email,password,name,surname,role){
            this.id = id;
            this.university_id = university_id;
            this.email = email;
            this.password = password;
            this.name = name;
            this.surname = surname;
            this.role = role;
    }
}
module.exports = User;