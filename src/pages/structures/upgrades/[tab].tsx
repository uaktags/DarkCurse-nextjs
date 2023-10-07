import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useUser } from '@/context/users';
import { Fortifications, HouseUpgrades, OffenseiveUpgrades, SpyUpgrades} from '@/constants';

const UpgradeTab = () => {
  const router = useRouter();
  const { tab } = router.query;
  const { user, forceUpdate } = useUser();
  const currentPage = tab || 'fortifications';

  useEffect(() => {
    if (currentPage === 'fortifications') {
    }
  }, [currentPage]);

  const renderTable = (data, userLevel) => {
    return (
      <>
        <br />
      <table className="w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Level</th>
            <th>Cost</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(data)
            .filter(
              (item) =>
                (item.level || item.fortLevel) <= userLevel + 2
            )
            .map((item, index) => (
              <tr key={index}>
                <td>{item.name} {(item.level || item.fortLevel) === userLevel && ("(Current Upgrade)")}</td>
                <td>{item.level || item.fortLevel}</td>
                <td>{item.cost}</td>
                <td>
                  {(item.level || item.fortLevel) === userLevel + 1 && (
                    <button>Buy - Not Implemented Yet</button>
                  )}
                  {(item.level || item.fortLevel) === userLevel + 2 && (
                    <span>Unlock at level {userLevel + 1}</span>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
        </table>
        </>
    );
  };

  return (
    <div className="mainArea pb-10">
      <h2>Structure Upgrades</h2>
      <div className="mb-4 flex justify-center">
        <div className="flex space-x-2">
          <Link
            href="/structures/upgrades/fortifications"
            className={`border border-blue-500 px-4 py-2 hover:bg-blue-500 hover:text-white ${
              tab === 'fortifications' ? 'bg-blue-500 text-white' : ''
            }`}
            aria-current="page"
          >
            Fortifcations
          </Link>
          <Link
            href="/structures/upgrades/houses"
            className={`border border-blue-500 px-4 py-2 hover:bg-blue-500 hover:text-white ${tab === 'houses' ? 'bg-blue-500 text-white' : ''
              }`}
            aria-current="page"
          >
            Housing
          </Link>
          {/*<Link
            href="/structures/upgrades/mining"
            className={`border border-blue-500 px-4 py-2 hover:bg-blue-500 hover:text-white ${
              tab === 'mining' ? 'bg-blue-500 text-white' : ''
            }`}
          >
            Mining Upgrades
          </Link>*/}
          <Link
            href="/structures/upgrades/siege"
            className={`border border-blue-500 px-4 py-2 hover:bg-blue-500 hover:text-white ${
              tab === 'siege' ? 'bg-blue-500 text-white' : ''
            }`}
          >
            Siege Upgrades
          </Link>
          <Link
            href="/structures/upgrades/intel"
            className={`border border-blue-500 px-4 py-2 hover:bg-blue-500 hover:text-white ${
              tab === 'intel' ? 'bg-blue-500 text-white' : ''
            }`}
          >
            Clandestine Upgrades
          </Link>
        </div>
      </div>
      <div className="mb-4 flex justify-center">
        {currentPage === 'fortifications' && renderTable(Fortifications, user?.fortLevel, "Fortification Upgrades")}
        {currentPage === 'housing' && renderTable(HouseUpgrades, user?.houseLevel, "Housing Upgrades")}

        {/*currentPage === 'mining' && renderTable(MiningUpgrades, user?.miningLevel, "Mining Upgrades")*/}
        {currentPage === 'siege' && renderTable(OffenseiveUpgrades, user?.siegeLevel, "Siege Upgrades")}
        {currentPage === 'intel' && renderTable(SpyUpgrades, user?.intelLevel, "Clandestine Upgrades")}
      </div>
    </div>
  );
};
export default UpgradeTab;
