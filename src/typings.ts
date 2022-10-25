interface UserType {
    id?: string,
    firstname: string,
    lastname: string,
    email: { type: string, unique: true },
    username: { type: string, unique: true },
    password: string,
    confirmPassword: string
}