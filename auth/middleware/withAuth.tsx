"use client";
import React, { ComponentType } from "react";
import { useKeycloak } from "../provider/KeycloakProvider"; // Ensure correct import

interface WithAuthProps {
  [key: string]: any; // Allow any props for the wrapped component
}

const withAuth = <P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>
) => {
  const WithAuthComponent: React.FC<P> = (props) => {
    const { initialized, authenticated } = useKeycloak(); // Use the correct hook name

    if (!initialized) {
      return <div>Loading...</div>;
    }

    if (!authenticated) {
      return <div>Not authenticated</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
