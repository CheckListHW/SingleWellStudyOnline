const PDFDocument = require('pdfkit');

const traceItems = {
  '0': 'Выделение коллекторов',
  '1': 'Определение литологии',
  '2': 'Расчет глинистости',
  '3': 'Расчет пористости',
  '4': 'Расчет водонасыщенности',
  '5': 'Расчет проницаемости',
  '6': 'Расчет граничных значений',
  '7': 'Расчет базовых параметров (a, m, n, Rw)',
  '8': 'Определение типа флюида и ВНК',
  '9': 'Определение интервалов перфорации',
  '10': 'Подбор месторождения аналога',
  '11': 'Определение обстановки осадконакопления',
  '12': 'Заключение и рекомендации. Отправка результатов заказчику',
};

function makePdfReport(email, routeTimePoints, userScreenshotsList) {
  const doc = new PDFDocument();

  doc.registerFont('Roboto', './fonts/Roboto/Roboto-Regular.ttf');
  doc.font('Roboto');

  // first page

  doc.fontSize(44);
  doc.text(`Отчет по пользователю ${email}`, {
    align: 'center',
  });

  // stat page

  if (Object.keys(routeTimePoints).length !== 0) {
    doc.addPage();
    doc.fontSize(18);
    doc.text(`Статистика пользователя ${email}:`, { align: 'center' });
    doc.fontSize(10);
    doc.text(`Потрачено времени всего:${getFormattedTime(routeTimePoints.all)}`, 40, 120);
    doc.text(`Потрачено времени на построение трассы:${getFormattedTime(routeTimePoints.traceBuild)}`, 40, 140);
    Object.keys(routeTimePoints).forEach((item, index) => {
      if (item !== 'all' && item !== 'traceBuild') {
        doc.text(`Потрачено времени на пункт ${traceItems[item]}:${getFormattedTime(routeTimePoints[item])}`, 40, (index + 8) * 20);
      }
    });
  }

  // other pages

  if (userScreenshotsList.length !== 0) {
    userScreenshotsList.forEach(item => {
      doc.addPage({ layout: 'landscape' });
      doc.image(item.base64Image, 0, 0, { width: 800, height: 620 });
    });
  }

  doc.end();

  return doc;
}

function getRouteTimePoints(routeTime) {
  if (routeTime.length > 2) {
    const routeTimeCopy = routeTime.slice();
    routeTimeCopy.sort((a,b) => a.time - b.time);
    const tracePoints = routeTimeCopy.reduce((acc, item, index) => Number(item.tracePoint) >= 2
      ? { ...acc, [item.tracePoint.slice(1)]: (item.time - routeTimeCopy[index - 1].time) / 1000 }
      : acc,
    {});

    return {
      all: (routeTimeCopy[routeTimeCopy.length - 1].time - routeTimeCopy[0].time) / 1000,
      traceBuild: (routeTimeCopy[1].time - routeTimeCopy[0].time) / 1000,
      ...tracePoints,
    };
  }
  return {
    all: 0,
    traceBuild: 0,
  };
}

function getFormattedTime(timeInSeconds) {
  const hours = `${Math.floor(timeInSeconds / 3600) === 0 ? '' : ` ${Math.floor(timeInSeconds / 3600)} ч.`}`;
  const minutes = `${Math.floor((timeInSeconds % 3600) / 60) === 0 ? '' : `${Math.floor((timeInSeconds % 3600) / 60)} мин.`}`;
  const seconds = Math.round((timeInSeconds % 3600) % 60);
  return `${hours} ${minutes} ${seconds} сек.`;
}

module.exports.makePdfReport = makePdfReport;
module.exports.getRouteTimePoints = getRouteTimePoints;
