import DateFilter from '#base/url-paginator/components/date-filter';
import DebouncedInputFilter from '#base/url-paginator/components/debounced-input-filter';
import ToggleListFilter from '#base/url-paginator/components/toggle-list-filter';
import { Search, FilterList } from '@mui/icons-material';

export const FilterTypes = {
    SEARCH: 'SEARCH',
    TOGGLE_LIST: 'TOGGLE_LIST',
    DATE: 'DATE',
};

export const FilterComponent = ({ filterType, filterKey, ...rest }) => {
    switch (filterType) {
        case FilterTypes.SEARCH:
            return <DebouncedInputFilter {...rest} filterKey={filterKey} />;
        case FilterTypes.TOGGLE_LIST:
            return <ToggleListFilter {...rest} filterKey={filterKey} />;
        case FilterTypes.DATE:
            return <DateFilter {...rest} filterKey={filterKey} />;
        default:
            return null;
    }
};

export const FilterIcon = ({ filterType }) => {
    switch (filterType) {
        case FilterTypes.TOGGLE_LIST:
        case FilterTypes.DATE:
            return <FilterList fontSize="small" />;
        case FilterTypes.SEARCH:
            return <Search fontSize="small" />;
        default:
            break;
    }
};

export const getFilterTitlePreWord = filterType => {
    switch (filterType) {
        case FilterTypes.TOGGLE_LIST:
        case FilterTypes.DATE:
            return 'Filter by';
        case FilterTypes.SEARCH:
            return 'Search by';
        default:
            return '';
    }
};
