import React, {useState} from "react";
import {Modal, ModalContent, Link} from "@heroui/react";

import LoginComponent from "./LoginComponent";
import SignupComponent from "./SignupComponent";

export default function AuthModal({isOpen, onOpenChange}) {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <Modal isOpen={isOpen} backdrop={"blur"} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        {showLogin ? (
                            <>
                                <LoginComponent onClose={onClose}/>
                            </>
                        ) : (
                            <>
                                <SignupComponent setShowLogin={setShowLogin}/>
                            </>
                        )}
                        <p className="mt-4 text-center text-sm pb-6">
                            {showLogin ? "Don't have an account? " : "Already have an account? "}
                            <Link
                                onClick={() => setShowLogin(!showLogin)}
                                className="text-blue-600 hover:underline"
                                style={{cursor: "pointer"}}
                            >
                                Create account
                            </Link>
                        </p>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
