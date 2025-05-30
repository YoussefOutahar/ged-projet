import React from 'react';

import styles from './styles.module.scss';
import AuthGuard from 'app/component/auth/auth-guard.component';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';

const AuthLayout = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className={`min-h-screen ${styles.authLayoutRoot}`}>
      <Button 
            icon="pi pi-arrow-left"
            onClick={handleBack}
            className="absolute top-4 left-4 p-button-text p-button-plain"
            style={{ 
              color: '#4F46E5',
              padding: '0.5rem',
              fontSize: '0.875rem'
            }}
          />
      <div className={styles.authLayoutContainer}>
        <div className={styles.authLayoutLeft} >
          <div className="flex flex-column items-center w-fit  mx-auto " style={{ marginTop: "20%" }}>
            <div className="text-6xl  " style={{ letterSpacing: "0.5rem" }}>
              <span className="text-indigo-700 font-normal tracking-wider">YAN</span>
              <span className="text-cyan-400 font-normal">DOC</span>
            </div>
            <div className="text-xl  font-base text-green-700 ml-auto mr-2">
              SOLUTION
            </div>
          </div>
        </div>
        <div className={styles.authLayoutRight}>{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
