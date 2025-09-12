import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Dijitrend Shop Store. - Store Dashboard",
    description: "Dijitrend. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
