export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/content-management/pdf/templates',
      permanent: false
    }
  };
}

export default function Page() {
  return null;
}
