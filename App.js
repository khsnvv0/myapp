import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, AsyncStorage, ScrollView, Picker } from 'react-native';
import PushNotification from 'react-native-push-notification';
import Sound from 'react-native-sound';

const SecretApp = () => {
  const [status, setStatus] = useState(null);
  const [log, setLog] = useState([]);
  const [language, setLanguage] = useState('uz');
  const [intensity, setIntensity] = useState(null);

  const schedule = [
    { time: '18:00', message: language === 'uz' ? 'Suv ichishni to‘xtat' : 'Stop drinking water' },
    { time: '20:00', message: language === 'uz' ? 'Tish yuv, sokinlash' : 'Brush teeth, relax' },
    { time: '22:30', message: language === 'uz' ? 'Hojatga borib uxlashga yot' : 'Go to toilet and sleep' },
    { time: '02:30', message: language === 'uz' ? 'Uyg‘on, hojatga bor' : 'Wake up, go to toilet' },
    { time: '07:00', message: language === 'uz' ? 'Bugun quruq uyg‘ondingmi? Belgila' : 'Did you wake up dry today? Mark' },
  ];

  useEffect(() => {
    PushNotification.configure({});
    const checkTime = () => {
      const now = new Date();
      const current = now.toTimeString().slice(0, 5);
      const notify = schedule.find((e) => e.time === current);
      if (notify) {
        PushNotification.localNotification({ message: notify.message, soundName: 'default' });
        if (current === '20:00') {
          const sound = new Sound('relax_music.mp3', Sound.MAIN_BUNDLE, () => sound.play());
        }
      }
    };
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [language]);

  const handleMark = async (result, intensityLevel) => {
    const today = new Date().toISOString().slice(0, 10);
    const entry = { date: today, result, intensity: intensityLevel };
    const updatedLog = [...log.filter((e) => e.date !== today), entry];
    setLog(updatedLog);
    setStatus(result);
    setIntensity(intensityLevel);
    await AsyncStorage.setItem('log', JSON.stringify(updatedLog));
  };

  const weeklyStats = () => {
    const last7Days = log.slice(-7);
    const dryDays = last7Days.filter((e) => e.result === '?').length;
    return language === 'uz' ? `Haftada ${dryDays} kun quruq` : `Dry days this week: ${dryDays}`;
  };

  const monthlyStats = () => {
    const last30Days = log.slice(-30);
    const dryDays = last30Days.filter((e) => e.result === '?').length;
    return language === 'uz' ? `Oyda ${dryDays} kun quruq` : `Dry days this month: ${dryDays}`;
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1c2526', padding: 20 }}>
      <Picker selectedValue={language} style={{ height: 50, width: 150, color: '#fff' }} onValueChange={(itemValue) => setLanguage(itemValue)}>
        <Picker.Item label="O‘zbek" value="uz" />
        <Picker.Item label="Ðóññêèé" value="ru" />
        <Picker.Item label="English" value="en" />
      </Picker>
      <Text style={{ color: '#fff', fontSize: 24, marginBottom: 20 }}>
        {language === 'uz' ? 'Bugun quruq uyg‘ondingmi?' : 'Did you wake up dry today?'}
      </Text>
      <TouchableOpacity onPress={() => handleMark('?', intensity)} style={{ backgroundColor: '#2f4f4f', padding: 10, borderRadius: 10, margin: 10 }}>
        <Text style={{ color: '#fff' }}>? Ha</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleMark('?', intensity)} style={{ backgroundColor: '#2f4f4f', padding: 10, borderRadius: 10, margin: 10 }}>
        <Text style={{ color: '#fff' }}>? Yo‘q</Text>
      </TouchableOpacity>
      {status && (
        <>
          <Text style={{ color: '#fff', marginTop: 20 }}>
            {language === 'uz' ? 'Bugun holat qanchalik edi?' : 'How intense was it today?'}
          </Text>
          <TouchableOpacity onPress={() => setIntensity('Juda ko‘p')} style={{ backgroundColor: '#2f4f4f', padding: 10, borderRadius: 10, margin: 5 }}>
            <Text style={{ color: '#fff' }}>{language === 'uz' ? 'Juda ko‘p (3+ marta)' : 'A lot (3+ times)'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIntensity('O‘rtacha')} style={{ backgroundColor: '#2f4f4f', padding: 10, borderRadius: 10, margin: 5 }}>
            <Text style={{ color: '#fff' }}>{language === 'uz' ? 'O‘rtacha (1-2 marta)' : 'Moderate (1-2 times)'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIntensity('Kam')} style={{ backgroundColor: '#2f4f4f', padding: 10, borderRadius: 10, margin: 5 }}>
            <Text style={{ color: '#fff' }}>{language === 'uz' ? 'Kam (1 marta yoki ozgina)' : 'Little (1 time or slightly)'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIntensity('Umuman yo‘q')} style={{ backgroundColor: '#2f4f4f', padding: 10, borderRadius: 10, margin: 5 }}>
            <Text style={{ color: '#fff' }}>{language === 'uz' ? 'Umuman yo‘q (quruq)' : 'None (dry)'}</Text>
          </TouchableOpacity>
        </>
      )}
      <Text style={{ color: '#fff', marginTop: 20 }}>{weeklyStats()}</Text>
      <Text style={{ color: '#fff', marginTop: 10 }}>{monthlyStats()}</Text>
      <Text style={{ color: '#fff', fontSize: 20, marginTop: 20 }}>
        {language === 'uz' ? 'Davo Usullari' : 'Treatment Methods'}
      </Text>
      <Text style={{ color: '#fff', marginTop: 10 }}>
        {language === 'uz' ? '1. Kegel mashqlari: Har kuni 5 daqiqa siydik ushlash mushaklarini mashq qiling.' : '1. Kegel exercises: 5 minutes daily to strengthen muscles.'}
      </Text>
      <Text style={{ color: '#fff', marginTop: 5 }}>
        {language === 'uz' ? '2. Stressni boshqarish: Meditatsiya va nafas olish mashqlari.' : '2. Stress management: Meditation and breathing exercises.'}
      </Text>
      <Text style={{ color: '#fff', marginTop: 5 }}>
        {language === 'uz' ? '3. Uyqu tartibi: Ekran vaqtini kamaytiring, issiq vanna qabul qiling.' : '3. Sleep routine: Reduce screen time, take a warm bath.'}
      </Text>
      <Text style={{ color: '#fff', marginTop: 5 }}>
        {language === 'uz' ? '4. Ovqatlanish: Kechasi kofein va shirin ichimliklardan voz kechish.' : '4. Diet: Avoid caffeine and sugary drinks at night.'}
      </Text>
    </ScrollView>
  );
};

export default SecretApp;