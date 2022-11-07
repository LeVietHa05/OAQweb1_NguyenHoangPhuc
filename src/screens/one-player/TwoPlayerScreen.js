import './TwoPlayerScreen.css'
import React, { useEffect, useState } from 'react'
import { wait } from '@testing-library/user-event/dist/utils';

const sleep = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);

const adj = [
  { 'l': 10, 'r': 1 },
  { 'l': 0, 'r': 2 },
  { 'l': 1, 'r': 3 },
  { 'l': 2, 'r': 4 },
  { 'l': 3, 'r': 11 },
  { 'l': 6, 'r': 10 },
  { 'l': 7, 'r': 5 },
  { 'l': 8, 'r': 6 },
  { 'l': 9, 'r': 7 },
  { 'l': 11, 'r': 8 },
  { 'l': 5, 'r': 0 },
  { 'l': 4, 'r': 9 }
]
const OnePlayerScreen = () => {
  let oo = 1;
  //for (let i = 0; i < 30e7; i++) { oo++; oo /= 2; oo += 2; oo %= 2; }
  //console.log("Spell")

  //setTimeout(()=>{})

  const [valueDanBan, setValueDanBan] = useState([5, 5, 5, 5, 5]);
  const [valueDanMay, setValueDanMay] = useState([5, 5, 5, 5, 5]);
  const [valueQuan, setValueQuan] = useState([0, 0]);
  const [isQuan, setIsQuan] = useState([1, 1]);
  const [hand, setHand] = useState(0);
  const [scoreBan, setScoreBan] = useState(0);
  const [scoreMay, setScoreMay] = useState(0);
  const [clickable, setClickable] = useState(true);
  const [turn, setTurn] = useState(1);
  const [idx, setIdx] = useState(-1);
  const [direction, setDirection] = useState('?')
  const [taking, setTaking] = useState(0);
  const [skipping, setSkipping] = useState(1)
  const [result, setResult] = useState(['Bạn đã thắng', 'Lmao'])
 
  ////console.log("clickable: " + clickable)
  let play = !clickable
  let instantIndex = idx
  let instantDir = direction
  let tmpArrBan = valueDanBan
  let tmpArrMay = valueDanMay
  ////console.log(turn)

  ////console.log("index: " + idx)
  ////console.log("hand: " + hand)
  ////console.log("play: " + play)

  // setValueDanBan((id, val)=>{
  //   valueDanBan[id] += val;
  // })

  // useEffect(async() => {
  //   //console.log("Cast")
    
  // }, [idx])

  useEffect(() => {
    async function fetchData() {
      // You can await here
      await magic(idx, direction)
      // ...
    }
    fetchData();
  }, [idx]);

  const handleValueDan = (index, value) => {
    //if(value > 100) //console.log("yes sir")
    if (index < 5) {
      tmpArrBan = [...valueDanBan]
      tmpArrBan[index] += value
      setValueDanBan(tmpArrBan)
    }
    else if (index < 10) {
      tmpArrMay = [...valueDanMay]
      tmpArrMay[index - 5] += value
      setValueDanMay(tmpArrMay)
    }
    else {
      let tmpArr = [...valueQuan]
      tmpArr[index - 10] += value
      setValueQuan(tmpArr)
    }
  }
  const handleScore = (value) => {
    if (turn == 1) {
      setScoreBan(scoreBan + value)
    }
    else {
      setScoreMay(scoreMay + value)
    }
  }
  const handleHand = (value) => {
    setHand(hand + value);
  }
  const handleIsQuan = (index) => {
    let tmpArr = [...isQuan]
    if (tmpArr[index - 10] != 0) {
      //handleScore(100); 
      //console.log('an quan');
    }
    tmpArr[index - 10] = 0;
    setIsQuan(tmpArr)
  }
  const getValueDan = (index) => {
    if (index < 5) {
      return valueDanBan[index]
    }
    if (index < 10) {
      return valueDanMay[index - 5]
    }
    return valueQuan[index - 10]
  }
  const checkIndex = (index) => {
    if (getValueDan(index) == 0) return true
  }
  const handleIdx = () => {
    setIdx(adj[instantIndex][instantDir])
  }

  const reset = () => {
    setClickable(true)
    setTaking(0)
    setSkipping(1)
    setIdx(-1)
  }
  const refillField = () => {
    if(turn == 2){
      let sum5 = tmpArrBan.reduce( (a,b) => {return a+b} )
      if(sum5 == 0){
        setScoreBan(scoreBan - 5);
        setValueDanBan([1,1,1,1,1,]);
      }
    }
    else{
      let sum5 = tmpArrMay.reduce( (a,b) => {return a+b} )
      if(sum5 == 0){
        setScoreMay(scoreMay - 5);
        setValueDanMay([1,1,1,1,1,]);
      }
    }
  }

  const noQuan = () => {
    return !(isQuan[0] + isQuan[1])
  }
  const endTurn = () => {
    //console.log("END TURN")
    setTurn(3 - turn)
    if(!noQuan()) refillField()
    reset();
  }
  
  const endGame = () => {
    let sumDanBan = tmpArrBan.reduce( (a,b) => {return a+b} );
    let sumDanMay = tmpArrMay.reduce( (a,b) => {return a+b} );
    setScoreBan(scoreBan + sumDanBan);
    setScoreMay(scoreMay + sumDanMay); 
    setValueDanBan([0,0,0,0,0]);
    setValueDanMay([0,0,0,0,0]);
  }
  const restart = () => {
    
  }
  const takeable = (index) => {
    if (index < 10) return getValueDan(index);
    if (valueQuan[index - 10] < 5 && isQuan[index - 10]) return 0;
    handleIsQuan(index);
    if (isQuan) return 5 + getValueDan(index);
    else return getValueDan(index)
  }
  const pebVal = (peb) => {
    if(peb > 10) return 10
    return peb
  }

  const magic = async(index, dir) => {
    await sleep(300)
    //console.log("Magic");
    //console.log(idx)
    if (noQuan()) {
      endGame()
    }
    ////console.log("magic")
    if (index == -1) {
      ////console.log("bcz: " + index)
      reset();
      return;
    }
    if (idx == -1 && index != -1) {
      setIdx(index)
      //return;
    }
    instantIndex = index
    if (checkIndex(index) && !play) {
      reset();
      return;
    }
    ////console.log('yes')
    setClickable(false);
    setDirection(dir);
    instantDir = dir;

    let btn_l = 'btn-m' + `(${index})` + '-l';
    let btn_r = 'btn-m' + `(${index})` + '-r'
    let val = 'val-m' + `(${index})`
    let value = getValueDan(index)
    ////console.log('da_value' + value)
    if (taking) {
      if (skipping) {
        if (checkIndex(index)) {
          handleIdx()
        }
        else {
          endTurn()
        }
        setSkipping(0)
      }
      else {
        if (checkIndex(index)) {
          endTurn()
        }
        else if (takeable(index)) {
          handleScore(takeable(index))
          handleValueDan(index, -value)
          handleIdx()
        }
        else {
          endTurn()
        }
        setSkipping(1)
      }
    }

    else if (play) {
      if (hand > 0) {
        //console.log('huh')
        handleHand(-1)
        handleValueDan(index, 1)
        handleIdx()
        return
      }
      if (!checkIndex(index) && index < 10) {
        //console.log('steal :' + value)
        handleHand(value)
        handleValueDan(index, -value)
        //console.log('lmao')
        handleIdx()
        return
      }
      if (checkIndex(index)) {
        setTaking(1);
        setSkipping(0)
        handleIdx()
        return;
      }
      if (index > 9) {
        endTurn();
        return;
      }
      reset()
    }
  }

  let o_quan = ['o-quan gold' + `${isQuan[0]}`, 'o-quan gold' + `${isQuan[1]}`]
  let o_quan_dan = ['o-quan-dan peb' + `${getValueDan(10)}`, 'o-quan-dan peb' + `${getValueDan(11)}`]

  return (
    <div>
      <div className='back'
        onClick={() => {
          ////console.log("start")
          //magic(2, 'l');
          ////console.log("end")
        }}
      >
        ←
      </div>
      <div className='p2'>
        <div className='info'>
          <div>Player 2</div>
          <div>
            Score: {" "}
            {scoreMay}
          </div>
        </div>
        <div className='win'>
          {/* {result[0]} */}
        </div>
      </div>
      <div className='outer-board'>
        <div className='board'>
          <div className='nha-quan-l'>
            <div className={o_quan[0]}>

            </div>
            <div className={o_quan_dan[0]}
              onMouseEnter={() => {
                ////console.log('hovered');
                let mid = document.getElementById("val-q0")
                mid.classList.remove('hide-num')
              }}
              onMouseLeave={() => {
                ////console.log('left')
                let mid = document.getElementById("val-q0")
                mid.classList.add('hide-num')

              }}
            >
              <div id="val-q0" className='hide-num num-inside'>
                {valueQuan[0]}
              </div>
            </div>
          </div>

          {/* -------- khu dan ------------------- */}
          <div className='khu-dan'>
            <div className='nha-dan'>
              {
                valueDanMay.map((value, index) => {
                  let btn_l = 'btn-m' + `(${index+5})` + '-l';
                  ////console.log(btn_l);
                  let btn_r = 'btn-m' + `(${index+5})` + '-r'
                  let val = 'val-m' + `(${index+5})`
                  let peb = getValueDan(index+5)
                  let o_dan = 'o-dan-tren peb' + `${pebVal(peb)}`
                  console.log(o_dan)
                  return (
                    <div className={o_dan}
                      onMouseEnter={() => {
                        ////console.log('hovered');
                        let l = document.getElementById(btn_l)
                        let mid = document.getElementById(val)
                        let r = document.getElementById(btn_r)

                        if(turn == 2 && clickable) l.classList.remove('hide-btn')
                        mid.classList.remove('hide-num')
                        if(turn == 2 && clickable) r.classList.remove('hide-btn')
                      }}
                      onMouseLeave={() => {
                        ////console.log('left')
                        let l = document.getElementById(btn_l)
                        let mid = document.getElementById(val)
                        let r = document.getElementById(btn_r)

                        l.classList.add('hide-btn')
                        mid.classList.add('hide-num')
                        r.classList.add('hide-btn')

                      }}
                    >
                      <div id={btn_l} className='hide-btn num-inside'
                        onClick={async() => {
                          ////console.log('click left')
                          if (!play && turn == 2) await magic(index + 5, 'r')
                        }}
                      > {'<'}
                      </div>
                      <div id={val} className='hide-num num-inside'>
                        {value}
                      </div>
                      <div id={btn_r} className='hide-btn num-inside'
                        onClick={async() => {
                          ////console.log('click right')
                          if (!play && turn == 2) await magic(index + 5, 'l')
                        }}
                      > {'>'}
                      </div>
                    </div>
                  )

                })
              }
            </div>
            <div className='nha-dan'>
              {
                valueDanBan.map((value, index) => {
                  let btn_l = 'btn-d' + `(${index})` + '-l';
                  ////console.log(btn_l);
                  let btn_r = 'btn-d' + `(${index})` + '-r'
                  let val = 'val-d' + `(${index})`
                  let peb = getValueDan(index)
                  let o_dan = 'o-dan-duoi peb' + `${pebVal(peb)}`
                  //console.log(o_dan + "*")
                  return (
                    <div className={o_dan}
                      onMouseEnter={() => {
                        ////console.log('hovered');
                        let l = document.getElementById(btn_l)
                        let mid = document.getElementById(val)
                        let r = document.getElementById(btn_r)

                        if(turn == 1 && clickable) l.classList.remove('hide-btn')
                        mid.classList.remove('hide-num')
                        if(turn == 1 && clickable) r.classList.remove('hide-btn')
                      }}
                      onMouseLeave={() => {
                        ////console.log('left')
                        let l = document.getElementById(btn_l)
                        let mid = document.getElementById(val)
                        let r = document.getElementById(btn_r)

                        l.classList.add('hide-btn')
                        mid.classList.add('hide-num')
                        r.classList.add('hide-btn')

                      }}
                    >
                      <div id={btn_l} className='hide-btn num-inside'
                        onClick={async() => {
                          ////console.log('click left')
                          if (!play && turn == 1) await magic(index, 'l')
                        }}
                      > {'<'}
                      </div>
                      <div id={val} className='hide-num num-inside'>
                        {value}
                      </div>
                      <div id={btn_r} className='hide-btn num-inside'
                        onClick={async() => {
                          ////console.log('click right')
                          if (!play && turn == 1) await magic(index, 'r')
                        }}
                      > {'>'}
                      </div>
                    </div>
                  )

                })
              }
            </div>
          </div>
          <div className='nha-quan-r'>
            <div className={o_quan[1]}>

            </div>
            <div className={o_quan_dan[1]}
              onMouseEnter={() => {
                ////console.log('hovered');
                let mid = document.getElementById("val-q1")
                mid.classList.remove('hide-num')
              }}
              onMouseLeave={() => {
                ////console.log('left')
                let mid = document.getElementById("val-q1")
                mid.classList.add('hide-num')

              }}
            >
              <div id="val-q1" className='hide-num num-inside'>
                {valueQuan[1]}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='p1'>
        <div className='info'>
          <div>PLayer 1</div>
          <div>
            Score: {" "}
            {scoreBan}
          </div>
        </div>
        <div className='win'>
          {/* {result[0]} */}
        </div>
      </div>
    </div>
  )
}

export default OnePlayerScreen


  // const magic = (index, dir) => {
  //   //console.log("wtf")
  //   //console.log(getValueDan(index))
  //   if (checkIndex(index)) {
  //     //console.log("vcl");
  //     return;
  //   }
  //   //console.log("okok")
  //   setClickable(false);
  //   let play = 1, take = 0, skip = 1;
  //   while (play) {
  //     while (take) {
  //       if (skip) {
  //         if (checkIndex(index)) {
  //           index = adj[index][dir]
  //           skip = 0
  //         }
  //         else {
  //           play = 0;
  //           break;
  //         }
  //       }
  //       else {
  //         if (checkIndex(index)) {
  //           play = 0;
  //           break;
  //         }
  //         else {
  //           handleScore(getValueDan(index));
  //           skip = 1
  //         }
  //       }
  //     }
  //     if (!play) break;

  //     //console.log("hand: " + `${hand}`);
  //     while (hand > 0) {
  //       //console.log("index:" + index)
  //       wait(5000);
  //       handleHand(-1);
  //       handleValueDan(index, 1);
  //       index = adj[index][dir]
  //     }
  //     if (!checkIndex(index) && index < 10) {
  //       //console.log("steal")
  //       handleHand(getValueDan(index));
  //       handleValueDan(index, -getValueDan(index))
  //       index = adj[index][dir]
  //       //console.log("index:" + index);
  //       continue;
  //     }
  //     if (getValueDan) {
  //       take = 1;
  //       continue;
  //     }
  //     if (index > 9) {
  //       play = 0;
  //       break;
  //     }
  //   }
  //   setTurn(3 - turn);
  //   setClickable(true);
  // }