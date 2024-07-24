import { LetterHeader } from "../Header/Header"
import { component } from "~/utils/component"

export const CoverLetter = component('CoverLetter', function({ className }) {
    return (
        <div className={this.mcn(className)}>
            <LetterHeader />
        </div>
    )
})