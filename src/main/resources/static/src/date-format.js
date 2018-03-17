import moment from '../node_modules/moment/moment';

export class DateFormatValueConverter {
    toView(value) {
    return moment(value).format('D/M/YYYY hh:mm:ss');
    }
}