import {
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    EmbeddedViewRef,
    Injectable,
    Injector,
    Type
} from '@angular/core';

import { first } from 'rxjs/operators';
import { DynamicModalComponent } from '../components/modal/dynamic-modal.component';
import { ModalInjector } from '../components/modal/modal-injector';
import { ModalRef } from '../components/modal/modal.ref';

export class ModalConfig<D = any> {
    data?: D;
}

@Injectable()
export class ModalService {
    modalComponentRef: ComponentRef<DynamicModalComponent>;

    protected modalOpen = false;

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private applicationRef: ApplicationRef,
        private injector: Injector) {}

    open(componentType: Type<any>, config: ModalConfig) {
        // Prevent showing multiple modals at the same time
        if (this.modalOpen) {
            return;
        }
        this.modalOpen = true;

        const modalRef = this.appendModalComponentToBody(config);

        // onClose is used in Web to hook into bootstrap. On other projects we directly pipe it to closed.
        modalRef.onClose.pipe(first()).subscribe(() => {
            modalRef.closed();

            document.body.classList.remove('modal-open');
            document.body.removeChild(document.querySelector('.modal-backdrop'));
        });

        // Add backdrop, setup [data-dismiss] handler.
        modalRef.onCreated.pipe(first()).subscribe(el => {
            document.body.classList.add('modal-open');
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade';
            document.body.appendChild(backdrop);

            el.querySelector('.modal-dialog').addEventListener('click', (e: Event) => {
                e.stopPropagation();
            });

            const modals = Array.from(el.querySelectorAll('.modal, .modal *[data-dismiss="modal"]'));
            for (const closeElement of modals) {
                closeElement.addEventListener('click', event => {
                    modalRef.close();
                });
            }
        });

        this.modalComponentRef.instance.childComponentType = componentType;

        return modalRef;
    }

    protected appendModalComponentToBody(config: ModalConfig) {
        const modalRef = new ModalRef();

        const map = new WeakMap();
        map.set(ModalConfig, config);
        map.set(ModalRef, modalRef);

        modalRef.onClosed.pipe(first()).subscribe(() => {
            this.removeModalComponentFromBody();
        });

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DynamicModalComponent);
        const componentRef = componentFactory.create(new ModalInjector(this.injector, map));

        this.applicationRef.attachView(componentRef.hostView);

        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);

        this.modalComponentRef = componentRef;

        return modalRef;
    }

    protected removeModalComponentFromBody() {
        this.applicationRef.detachView(this.modalComponentRef.hostView);
        this.modalComponentRef.destroy();
        this.modalOpen = false;
    }
}