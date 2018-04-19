import {Component} from "inferno";

import coverPlaceholder from "../../../img/coverPlaceholder.jpeg";
// import illustrationPlaceholder from "../../../img/illustrationPlaceholder.jpeg";

class NewProject extends Component {
    render() {
        return (
            <div className={"container-fluid maxHeight"}>
                <div className={"row"}>
                    <img
                        alt={"Cover"}
                        src={coverPlaceholder}
                        className={"newProjectCover"}
                    />
                    <input
                        type={"text"}
                        placeholder={"Title"}
                        className={"newProjectTitle"}
                    />
                </div>
                <div className={"row mt-5"}>
                    <div className={"col-9"}>
                        <h2>Pitch</h2>
                        <textarea className={"textarea edition maxHeight"}></textarea>
                    </div>
                    <div className={"col"}>
                        <svg x="0px" y="0px" width="100%" height="100%" xml:space="preserve" style="transform: rotate(0deg);">
                            <path fill="rgba(255, 255, 255, 1)" d="m188 264c-15 0-28 13-28 28c0 15 13 28 28 28c15 0 28-13 28-28c0-15-13-28-28-28z m136 0c-15 0-28 13-28 28c0 15 13 28 28 28c16 0 28-13 28-28c0-15-12-28-28-28z m145-253l-85 85l-55-83c-5-7-13-7-18 0l-55 83l-55-83c-5-7-13-7-18 0l-55 83l-85-85c-6-6-10-4-8 5l29 144l0 48c0 9 7 16 16 16l-8 0c-5 20-8 42-8 64c0 124 128 224 192 224c64 0 192-100 192-224c0-22-3-44-8-64l-8 0c9 0 16-7 16-16l0-48l29-144c2-9-2-11-8-5z m-213 469c-45 0-160-85-160-192c0-22 3-44 9-64l302 0c6 20 9 42 9 64c0 107-115 192-160 192z m160-288l-320 0l0-32l320 0z" transform="scale(0.287109375, 0.287109375)"></path>
                        </svg>
                    </div>
                </div>
                <div className={"row  mt-5"}>
                    <div className={"col"}>
                        <h2>Description</h2>
                        <textarea className={"textarea edition maxHeight"}></textarea>
                    </div>
                </div>
                <div className={"row"}></div>
                <div className={"row"}></div>
                <div className={"row"}></div>
            </div>
        );
    }
}

export default NewProject;
