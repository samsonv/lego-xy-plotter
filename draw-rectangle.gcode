G21         ; Set units to mm
G90         ; Absolute positioning
G1 Z2.54 F2540      ; Move to clearance level

;
; Operation:    0
; Name:         
; Type:         Engrave
; Paths:        1
; Direction:    Conventional
; Cut Depth:    0.175
; Pass Depth:   3.175
; Plunge rate:  127
; Cut rate:     1016
;

; Path 0
; Rapid to initial position
G1 X106.2497 Y-37.5001 F2540
G1 Z0.0000
; plunge
G1 Z-0.1750 F127
; cut
G1 X49.9999 Y-37.5001 F1016
G1 X49.9999 Y-87.5000
G1 X106.2497 Y-87.5000
G1 X106.2497 Y-37.5001
G1 X106.2497 Y-37.5001
; Retract
G1 Z2.5400 F2540
M2
