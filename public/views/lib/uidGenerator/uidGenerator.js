
class UidGenerator{

    static generate(){
        return Date.now() + "_" + Number(Math.trunc(Math.random() *9e6 + 1e6)).toString(36);
    }

}

export default UidGenerator;