angular.module('RPJeeves',[])
    .controller('RPJeevesController',['$scope', RPJeevesController]);

function RPJeevesController($scope){
    $scope.test = 'butt';

    $scope.placeholder = 'YEAH BUDDY';

    $scope.monster = {
        name: 'Lion Beast of Chaos',
        init: '+7',
        ac : '19, touch: 12, flat-footed: 16',
        hp: 24,
        xp: 1600,
        hd: '5d10+10',
        saves: 'fort +6 ,ref +7, will +2',
        sr: 16,
        speed: 40,
        melee: '2 claws +8 (1d4+6), bite +8 (1d6+6 plus grab)',
        reach: 5,
        str: 23,
        dex: 17,
        con: 15,
        int: 2,
        wiz: 12,
        cha: 10,
        base_atk: 3,
        cmb: '+10 (+14 grapple)',
        cmd: '23 (27 vs. trip)',
        feats: 'improved initiative, run, skill focus (perception)',
        skills: 'Acrobatics +11, Perception +9, Stealth +8 (12 in undergrowth)',
        racial_modifiers: '+4 Acrobatics, +4 Stealth (+8 in undergrowth)'
    }
}