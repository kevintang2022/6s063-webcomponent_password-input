class PasswordInput extends HTMLElement {
	
    #_value = "";
    #password_shown = true;
    #input_field;
	constructor() {
        super();
        
        this.attachShadow({mode: "open"});
		this.shadowRoot.innerHTML = `
                        <link rel="stylesheet" href="shadowdom.css">
                            
        `;

        const input_container = document.createElement("div");
        input_container.setAttribute("id", "input_container");


        this.#input_field = document.createElement("input");
        this.#input_field.setAttribute("part", "textbox");

        const show_button = document.createElement("button");
        show_button.setAttribute("id","show_button");
        show_button.setAttribute("part", "toggle");

        const char_limit = document.createElement("div");
        char_limit.setAttribute("id", "length_info");

        input_container.appendChild(this.#input_field);
        input_container.appendChild(show_button);
        input_container.appendChild(char_limit);

        this.shadowRoot.appendChild(input_container);
    }

    get value() {return this.#_value;}
    set value(v) {
        
        
        this.#_value = v;
        this.setAttribute("value", v);
    }


    static get observedAttributes(){
        return ["shown", "minlength", "maxlength","value"];
    }
    attributeChangedCallback(name, oldValue, newValue){
        if (name === "shown"){
            this.#password_shown = this.hasAttribute("shown");
            
        }
        else if (name === "minlength"){
            this.#input_field.setAttribute("minlength", newValue);
        }
        else if (name === "maxlength"){
            this.#input_field.setAttribute("maxlength", newValue);
        }
        else if (name === "value"){
            this.#input_field.value = newValue;
        }
        
        this.#render();
    }
    

	connectedCallback() {
        this.#password_shown = this.hasAttribute("shown");
        this.shadowRoot.querySelector("button").addEventListener("click", (evt) => {
            if (this.#password_shown){
                
                this.dispatchEvent(new CustomEvent('password_visibility', { detail: "hidden", bubbles:true,composed:true }));
            }
            else{
                
                this.dispatchEvent(new CustomEvent('password_visibility', { detail: "shown",bubbles:true,composed:true }));
            }
        });
        this.#input_field.addEventListener("input", () => {
            this.value = this.#input_field.value;
            
        });

        this.addEventListener("password_visibility", (evt) => {
            if (evt.detail === "shown"){
                this.setAttribute("shown","");
                this.shadowRoot.querySelector("button").textContent = "hide";
            }
            else {
                this.removeAttribute("shown");
                this.shadowRoot.querySelector("button").textContent = "show";
            }
        });
        if (this.hasAttribute("minlength")){
            this.#input_field.setAttribute("minlength", this.getAttribute("minlength"));
        }
        if (this.hasAttribute("maxlength")){
            this.#input_field.setAttribute("maxlength", this.getAttribute("maxlength"));
        }
        if (this.hasAttribute("maxlength")){
            this.#input_field.setAttribute("maxlength", this.getAttribute("maxlength"));
        }
        if (this.hasAttribute("value")){
            this.value = this.getAttribute("value");
        }
        else{
            this.value = "";
        }
        

        this.#render();
	}
	disconnectedCallback() {
		
	}
	#render () {
		if (this.#password_shown){
            this.#input_field.setAttribute("type","text");
            this.shadowRoot.querySelector("button").textContent = "hide";
        }
        else{
            this.#input_field.setAttribute("type","password");
            this.shadowRoot.querySelector("button").textContent = "show";
        }
        this.shadowRoot.querySelector("#length_info").textContent = `${this.#_value.length}`;
        
	}
}
customElements.define('password-input', PasswordInput);
//🙈🙊🙉