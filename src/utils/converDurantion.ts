export function converter(duration: number){
    const horas = Math.floor(duration /3600);
    const minutes = Math.floor((duration%3600) / 60);
    const second = duration % 60;
    const finalResult = [horas, minutes,second].map(el =>String(el).padStart(2, '0')).join(':');

    return finalResult;

}