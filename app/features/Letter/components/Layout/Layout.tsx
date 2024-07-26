import { LetterHeader } from "../Header/Header"
import { PropsWithChildren } from "react"
import { component } from "~/utils/component"

export const LetterLayout = component<PropsWithChildren>('LetterLayout', function({ className, children }) {
    return (
        <div className={this.mcn(className)}>
            <LetterHeader />
            <div className={this.__('Content')}>
                {children}
            </div>
        </div>
    )
})