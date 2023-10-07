
export class MessageTooLongError extends Error {
}

export class MessageEmptyError extends Error {
}
// logique pur
export class Message {
    constructor(private readonly _id: string, private readonly _author: string, private readonly _text: MessageText, private readonly _publishedAt: Date) {
    }

    get id(): string {
        return this._id;
    }

    get author(): string {
        return this._author;
    }

    get text(): MessageText {
        return this._text;
    }

    get publishedAt(): Date {
        return this._publishedAt;
    }


    //retourne que des type scalaires donc séréalsiable
    //En résumé, un type scalaire sérialisable est un type scalaire qui peut être converti en une séquence de bits qui peut être stockée ou transmise.
    /**
     * Voici quelques exemples de types scalaires sérialisables en SQL :
     *
     * int
     * float
     * char
     * bool
     * varchar
     * date
     * time
     * datetime
     * timestamp
     *
     *
     * Voici quelques exemples de types de données non sérialisables :
     *
     * Tableaux
     * Objets
     * Structures
     * Pointeurs
     * Références
     * Objets graphiques
     * Objets de base de données
     *
     *
     * reoutnr le contrat public de ce qu est un message avec que des types scalaires
     * donc uniquement ce qui est séréalisable
     *
     */
    get data() {
        return {
            id: this.id,
            author: this.author,
            text: this._text.value,
            publishedAt: this.publishedAt
        }
    }


    /**
     * data c est le retour de ce que renvoie data
     * ça infére le type , et ça drive le type qu on attend en entrée
     * @param data
     */
    static fromData(data:  Message["data"]) {
        return new Message(
            data.id,
            data.author,
            MessageText.of(data.text),
            data.publishedAt
        )
    }

}

//value object
export class MessageText  {
    private constructor(readonly value: string) {
    }

    static of(text: string) {
        if (text.length > 280) throw new MessageTooLongError()
        if (text.trim().length === 0) throw new MessageEmptyError()

        return new MessageText(text)
    }

}




interface ValueObjectProps {
    [index: string] : any;
}


 import "isEqual" from "loaddash
export abstract class ValueObject<T extends ValueObjectProps> {
    public readonly props : T;
    constructor(props:T) {
        this.props = Object.freeze(props)
    }

    public equals(vo?: ValueObject<T>) : boolean{
        if(vo ===null || vo === undefined){
            return false;
        }
        if(vo.props === undefined){
            return false;
        }
        return isEqual(this.props, vo.props)

        return this.props === vo.props
    }



}





