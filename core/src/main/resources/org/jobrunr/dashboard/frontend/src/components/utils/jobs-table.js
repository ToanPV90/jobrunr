import {Link, useNavigate, useLocation} from "react-router-dom";
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TimeAgo from "react-timeago/lib";
import makeStyles from '@mui/styles/makeStyles';
import LoadingIndicator from "../LoadingIndicator";
import JobLabel from "./job-label";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        //maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    content: {
        width: '100%',
    },
    table: {
        width: '100%',
    },
    noItemsFound: {
        padding: '1rem'
    },
    idColumn: {
        maxWidth: 0,
        width: '20%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    jobNameColumn: {
        width: '60%'
    },
    inline: {
        display: 'inline',
    },
}));

const JobsTable = (props) => {
    const classes = useStyles();
    const location = useLocation();
    const navigate = useNavigate();
    const isLoading = props.isLoading;
    const jobPage = props.jobPage;
    const jobState = props.jobState;

    let column;
    let columnFunction = (job) => job.jobHistory[job.jobHistory.length - 1].createdAt;
    switch (jobState) {
        case 'SCHEDULED':
            column = "Scheduled";
            columnFunction = (job) => job.jobHistory[job.jobHistory.length - 1].scheduledAt;
            break;
        case 'ENQUEUED':
            column = "Enqueued";
            break;
        case 'PROCESSING':
            column = "Started";
            break;
        case 'SUCCEEDED':
            column = "Succeeded";
            break;
        case 'FAILED':
            column = "Failed";
            break;
        case 'DELETED':
            column = "Deleted";
            break;
        default:
        // code block
    }

    const handleChangePage = (event, newPage) => {
        let urlSearchParams = new URLSearchParams(location.search);
        urlSearchParams.set("page", newPage);
        navigate(`?${urlSearchParams.toString()}`);
    };

    return (
        <> {isLoading
            ? <LoadingIndicator/>
            : <> {jobPage.items < 1
                ? <Typography id="no-jobs-found-message" variant="body1" className={classes.noItemsFound}>No jobs
                    found</Typography>
                : <>
                    <TableContainer>
                        <Table id="jobs-table" className={classes.table} aria-label="jobs table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.idColumn}>Id</TableCell>
                                    <TableCell className={classes.jobNameColumn}>Job details</TableCell>
                                    <TableCell>{column}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {jobPage.items.map(job => (
                                    <TableRow key={job.id}>
                                        <TableCell component="th" scope="row" className={classes.idColumn}>
                                            <Link to={{
                                                pathname: `/dashboard/jobs/${job.id}`,
                                                job: job
                                            }}>{job.id}</Link>
                                        </TableCell>
                                        <TableCell>
                                            {job.labels &&
                                                <>
                                                    {job.labels.map((label) => <JobLabel text={label}/>)}
                                                    <span style={{marginRight: '0.5rem'}}></span>
                                                </>
                                            }
                                            <Link to={{
                                                pathname: `/dashboard/jobs/${job.id}`,
                                                job: job
                                            }}>{job.jobName}</Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link to={{pathname: `/dashboard/jobs/${job.id}`, job: job}}>
                                                <TimeAgo date={new Date(columnFunction(job))}
                                                         title={new Date(columnFunction(job)).toString()}/>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        id="jobs-table-pagination"
                        component="div"
                        rowsPerPageOptions={[]}
                        count={jobPage.total}
                        rowsPerPage={jobPage.limit}
                        page={jobPage.currentPage}
                        onPageChange={handleChangePage}
                    />
                </>
            }
            </>
        }
        </>
    );
}

export default JobsTable;