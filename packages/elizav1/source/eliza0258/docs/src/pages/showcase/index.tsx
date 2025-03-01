import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import { type User, sortedUsers } from '@site/src/data/users';
import ShowcaseSearchBar from './_components/ShowcaseSearchBar';
import ShowcaseCards from './_components/ShowcaseCards';
import ShowcaseFilters from './_components/ShowcaseFilters';

const TITLE = 'Plugin Showcase';
const DESCRIPTION = 'Discover the awesome plugins in our ecosystem';

function ShowcaseHeader() {
  return (
    <section className="margin-top--lg margin-bottom--lg text--center">
      <h1>{TITLE}</h1>
      <p>{DESCRIPTION}</p>
    </section>
  );
}

function filterUsers(users: User[], search: string, selectedTags: string[], operator: 'OR' | 'AND') {
  // First deduplicate the input array
  const uniqueUsers = users.filter((user, index, self) =>
    index === self.findIndex((u) => u.title === user.title)
  );

  return uniqueUsers.filter(user => {
    // Search filter
    if (search) {
      const searchValue = search.toLowerCase().trim();
      if (!user.title.toLowerCase().includes(searchValue) &&
          !user.description.toLowerCase().includes(searchValue)) {
        return false;
      }
    }

    // Tags filter
    if (selectedTags.length === 0) {
      return true;
    }

    if (operator === 'AND') {
      return selectedTags.every(tag => user.tags.includes(tag));
    }
    return selectedTags.some(tag => user.tags.includes(tag));
  });
}

export default function Showcase(): JSX.Element {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [operator, setOperator] = useState<'OR' | 'AND'>('OR');
  const [searchValue, setSearchValue] = useState('');

  const toggleTag = (tag: string) => {
    setSelectedTags(tags =>
      tags.includes(tag)
        ? tags.filter(t => t !== tag)
        : [...tags, tag]
    );
  };

  const toggleOperator = () => {
    setOperator(op => op === 'OR' ? 'AND' : 'OR');
  };

  const filteredUsers = useMemo(() => {
    return filterUsers(sortedUsers, searchValue, selectedTags, operator);
  }, [searchValue, selectedTags, operator]);

  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <main className="margin-vert--lg">
        <ShowcaseHeader />
        <ShowcaseFilters
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          operator={operator}
          toggleOperator={toggleOperator}
        />
        <div className="container flex justify-end">
          <ShowcaseSearchBar 
            onChange={setSearchValue}
            value={searchValue}
          />
        </div>
        <ShowcaseCards users={filteredUsers} />
      </main>
    </Layout>
  );
}
