import React , {useState} from 'react'; //* *For every file that uses jsx, YOU MUST IMPORT REACT  */
import {View, Text} from 'react-native';
import DatePicker from 'react-native-date-picker';
import ThinButton from '../Buttons/ThinButton';
import Sticker from '../Stickers/Sticker';

type Props = {
    serviceDate: Date, 
    getFormDate: (date: Date) => any
}


export default function DatePickerAndroid(props : Props){    
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const {getFormDate} = props;
    const startDate = new Date();
    const maxDate = new Date();

    startDate.setHours(0, 0, 0);
    maxDate.setDate(startDate.getDate() + 90);
    maxDate.setHours(0, 0, 0);

    const toggleShow = () => {
        setShow(!show);
    };

    const onChange = (selectedDate: Date) => {
        setShow(false);
        setDate(selectedDate);
        getFormDate(selectedDate);
        console.log(show);
    };

    
    return (
        /* * <ThinButton name="Date Picker for Andriod in Development" onClick={() => {getFormDate(new Date());}} /> * */
        <View>
            <ThinButton name='Select Date' onClick={toggleShow}/>
            {show && (<DatePicker 
                key='mobile datetime picker'
                date={date}
                minimumDate={startDate}
                maximumDate={maxDate}
                onDateChange={onChange}
                
            />)}
            <Sticker><Text>{date.toDateString()}</Text></Sticker>
        </View>
        );
        
};