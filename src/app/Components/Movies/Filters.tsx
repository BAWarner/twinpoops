import { useState, useEffect } from 'react';
import { UserType } from "@/app/types/movies.types";

import styles from '../../styles/filters.module.css';

interface FiltersProps{
    currentFilters: {[key: string]: string | number[] | boolean};
    handleFilterChange: (e: any) => void;
    categories?: string[] | null;
    users?: UserType[] | null;
}

const FiltersForm = (props: FiltersProps ) => {
    const { categories, currentFilters, handleFilterChange, users } = props;

    const [ filteredCategories, setFilteredCategories ] = useState<string[]| undefined | null >(categories);

    useEffect( () => {
        const sortedCategories = categories?.sort( (a:any, b:any) => a.localeCompare(b) );
        setFilteredCategories( sortedCategories  )
    }, [categories])

    return(
        <form className={styles.filtersForm}>
            { 
                filteredCategories && 
                filteredCategories.map( category => ( 
                    <label key={`input-key-for${category.toLowerCase().replaceAll(' ', '-')}`} >
                        <input 
                            name={category} 
                            checked={!!currentFilters[category]} 
                            onChange={ handleFilterChange } 
                            type="checkbox"
                         />
                         { category }
                    </label>
                ) )
            }
            {
                users &&
                (
                    <div className="filterUsers">
                        {users.map( user => (
                            <label key={`input-key-for-user-${user.displayname.toLowerCase().replaceAll(' ', '-')}`}>
                                <input
                                    type="checkbox"
                                    name='addedBy'
                                    value={ user.id }
                                    onChange={ handleFilterChange }
                                    checked={Array.isArray(currentFilters.addedBy) && currentFilters.addedBy.includes(user.id)}
                                />
                                { user.displayname }
                            </label>
                        ) )}
                    </div>
                )
            }

            <label>
                <input
                    type="checkbox"
                    name="mo"
                    checked={!!currentFilters.mo}
                    onChange={handleFilterChange}
                />
                    Miranda Only Movies
            </label>
        </form>
    );
}

export default FiltersForm;