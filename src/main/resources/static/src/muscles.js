import {UserAware} from 'user_aware';

export class Muscles extends UserAware{
    message="Muscles";

    constructor() {
        super();
    }


    attached() {
    $(() => {
            var start = moment().subtract(6, 'days');
            var end = moment();

            function cb(start, end) {
                $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            }

            $('#reportrange').daterangepicker({
                numberOfMonths : 1,
                autoUpdateInput : true,
                startDate: start,
                endDate: end,
                ranges: {
                   'Today': [moment(), moment()],
                   'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                   'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                   'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                   'This Month': [moment().startOf('month'), moment().endOf('month')],
                   'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }, cb);
            $('#reportrange').on('apply.daterangepicker', (ev, picker) => {
              console.log(picker.startDate.format('YYYY-MM-DD'));
              console.log(picker.endDate.format('YYYY-MM-DD'));
              this.start = picker.startDate.format('YYYY-MM-DD');
              this.end = picker.endDate.format('YYYY-MM-DD');
              this.getAllSetsList();
            })

            cb(start, end);

            });
        }

}