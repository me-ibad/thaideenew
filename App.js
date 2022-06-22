import {View, Text, Button, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import EscPosPrinter, {
  getPrinterSeriesByName,
  pairingBluetoothPrinter,
} from 'react-native-esc-pos-printer';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';
import Encoder from 'esc-pos-encoder'; 
export default function App() {



  const connectPrinter = async () => {
    EscPosPrinter.pairingBluetoothPrinter()
      .then(function () {
        alert('success');
        PrintName();
        PrintPos();
      })

      .catch(e => alert('pairing error:', e.message));
  };

  const LastTry = async () => {
    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        alert(enabled); // enabled ==> true /false
      },
      err => {
        alert(err);
      },
    );

    let options = {
      width: 40,
      height: 30,
      gap: 20,
      direction: BluetoothTscPrinter.DIRECTION.FORWARD,
      reference: [0, 0],
      tear: BluetoothTscPrinter.TEAR.ON,
      sound: 0,
      text: [
        {
          text: 'I am a testing txt',
          x: 20,
          y: 0,
          fonttype: BluetoothTscPrinter.FONTTYPE.SIMPLIFIED_CHINESE,
          rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
          xscal: BluetoothTscPrinter.FONTMUL.MUL_1,
          yscal: BluetoothTscPrinter.FONTMUL.MUL_1,
        },
        {
          text: '你在说什么呢?',
          x: 20,
          y: 50,
          fonttype: BluetoothTscPrinter.FONTTYPE.SIMPLIFIED_CHINESE,
          rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
          xscal: BluetoothTscPrinter.FONTMUL.MUL_1,
          yscal: BluetoothTscPrinter.FONTMUL.MUL_1,
        },
      ],
      qrcode: [
        {
          x: 20,
          y: 96,
          level: BluetoothTscPrinter.EEC.LEVEL_L,
          width: 3,
          rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
          code: 'show me the money',
        },
      ],
      barcode: [
        {
          x: 120,
          y: 96,
          type: BluetoothTscPrinter.BARCODETYPE.CODE128,
          height: 40,
          readable: 1,
          rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
          code: '1234567890',
        },
      ],
      image: [
        {
          x: 160,
          y: 160,
          mode: BluetoothTscPrinter.BITMAP_MODE.OVERWRITE,
          width: 60,
          image: base64Image,
        },
      ],
    };

    BluetoothTscPrinter.printLabel(options).then(
      () => {
        alert('success');
      },
      err => {
        alert(err);
      },
    );

    await BluetoothEscposPrinter.printText('结算账户：现金账户\n\r', {});
  };

  // print 2

  const PrintName = async () => {
    const encoder = new Encoder();

    encoder
      .initialize()
      .line('The quick brown fox jumps over the lazy dog')
      .newline()
      .newline()
      .newline()
      .cut('partial');

    let initialized = false;

    if (!initialized) {
      const printers = await EscPosPrinter.discover();

      const printer = printers[0];
      const {target, name} = printer;

      await EscPosPrinter.init({
        target: target,
        seriesName: getPrinterSeriesByName(name),
        language: 'EPOS2_LANG_EN',
      });

      initialized = true;
    }

    const status = await EscPosPrinter.printRawData(encoder.encode());

    alert('Print success!', status);
  };

  const PrintPos = async () => {
    try {
      const printers = await EscPosPrinter.discover();

      const printer = printers[0];

      await EscPosPrinter.init({
        target: printer.target,
        seriesName: getPrinterSeriesByName(printer.name),
        language: 'EPOS2_LANG_EN',
      });

      const printing = new EscPosPrinter.printing();

      const status = await printing
        .initialize()
        .align('center')
        .size(3, 3)
        .line('DUDE!')
        .smooth()
        .line('DUDE!')
        .smooth()
        .size(1, 1)
        .text('is that a ')
        .bold()
        .underline()
        .text('printer?')
        .bold()
        .underline()
        .newline(2)
        .align('center')
        .image(image, 200)
        .barcode({
          value: 'Test123',
          type: 'EPOS2_BARCODE_CODE93',
          hri: 'EPOS2_HRI_BELOW',
          width: 2,
          height: 50,
        })
        .qrcode({
          value: 'Test123',
          level: 'EPOS2_LEVEL_M',
          width: 5,
        })
        .cut()
        .addPulse()
        .send();

      console.log('Success:', status);
    } catch (e) {
      alert('error occor while print');
      console.log('Error:', e);
    }
  };

  return (
    <SafeAreaView
    style={{
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'white',
      alignItems: 'center',
    }}>
    <Text>Connect for print</Text>
    <Button
      onPress={() => connectPrinter()}
      title="Connect printer "
      accessibilityLabel="Learn more about this purple button"
    />

    <Text>Testing for print</Text>
    <Button
      onPress={() => PrintPos()}
      title="print"
      accessibilityLabel="Learn more about this purple button"
    />

    <Button
      onPress={() => PrintName()}
      title="print 2"
      accessibilityLabel="Learn more about this purple button"
    />

    <Button
      onPress={() => LastTry()}
      title="print 3"
      accessibilityLabel="Learn more about this purple button"
    />
  </SafeAreaView>
  )
}