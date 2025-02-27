export type IPasswordPolicy = {
    minLength: number;
    minNumbers: number ;
    minUpperLetters: number ; 
    minLowLetters: number ; 
    minSpecialCharacters: number ;
    acceptRepeatCharacters : number ;
    passwordExpiryDate: number;

}