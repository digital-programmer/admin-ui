import React, { useEffect, useState, useMemo } from "react";
import Header from "../../components/Header";
import { TableHeader, Pagination, Search } from "../../components/DataTable";
import useFullPageLoader from "../../hooks/useFullPageLoader";


const DataTable = () => {
    const [users, setUsers] = useState([]);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });

    const ITEMS_PER_PAGE = 10;

    const headers = [
        { name: " ", field: " ", sortable: false },
        { name: "Name", field: "name", sortable: true },
        { name: "Email", field: "email", sortable: true },
        { name: "Role", field: "role", sortable: false }
    ];

    useEffect(() => {
        const getData = () => {
            showLoader();

            fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
                .then(response => response.json())
                .then(json => {
                    hideLoader();
                    setUsers(json);
                });
        };

        getData();
    }, []);

    const usersData = useMemo(() => {
        let computedUsers = users;

        if (search) {
            computedUsers = computedUsers.filter(
                comment =>
                    comment.name.toLowerCase().includes(search.toLowerCase()) ||
                    comment.email.toLowerCase().includes(search.toLowerCase()) ||
                    comment.role.toLowerCase().includes(search.toLowerCase())
            );
        }

        setTotalItems(computedUsers.length);

        //Sorting users
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedUsers = computedUsers.sort(
                (a, b) =>
                    reversed * a[sorting.field].localeCompare(b[sorting.field])
            );
        }

        //Current Page slice
        return computedUsers.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );
    }, [users, currentPage, search, sorting]);

    return (
        <>
            <Header title="List of Users" />

            <div className="row w-100">
                <div className="col mb-3 col-12 text-center">
                    <div className="row">
                        <div className="col-md-6">
                            <Pagination
                                total={totalItems}
                                itemsPerPage={ITEMS_PER_PAGE}
                                currentPage={currentPage}
                                onPageChange={page => setCurrentPage(page)}
                            />
                        </div>
                        <div className="col-md-6 d-flex flex-row-reverse">
                            <Search
                                onSearch={value => {
                                    setSearch(value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>

                    <table className="table table-striped">
                        <TableHeader
                            headers={headers}
                            onSorting={(field, order) =>
                                setSorting({ field, order })
                            }
                        />
                        <tbody>
                            {usersData.map(user => (
                                <tr key={user.id}>
                                    <th scope="row" >
                                        <input type="checkbox" id={`list-${user.id}`} />
                                    </th>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <button type="button" class="btn btn-danger float-left">Delete Selected</button>
            {loader}
        </>
    );
};

export default DataTable;