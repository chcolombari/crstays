# Phase 5F — CTA audit before implementation

Website main: `a4222ebe649e98879a25361343551cf2ce5982f1`. Backend main: `0fedc97d59a462568b4ae9153bffd84748407380`.

All static links/buttons are included, including navigation and guest booking/support, to distinguish them from owner leads. Repeated labels have separate rows and source line numbers. Dynamic Analyzer actions are documented below.


## En/crstays-booking.html

| Line | Visible label | Current destination | User intent | Category | Recommended destination |
|---|---|---|---|---|---|
| 206 | Go to book.crstays.com | https://book.crstays.com/ | Read information / guest journey | general navigation | https://book.crstays.com/ |
| 212 | ← CR Stays | ../en/index.html | Read information / guest journey | general navigation | ../en/index.html |
| 214 | ES | ../crstays-booking.html | Read information / guest journey | general navigation | ../crstays-booking.html |
| 293 | − | changeGuests(-1) | Read information / guest journey | general navigation | changeGuests(-1) |
| 295 | + | changeGuests(1) | Read information / guest journey | general navigation | changeGuests(1) |
| 298 | Check Availability | doSearch() | Read information / guest journey | general navigation | doSearch() |
| 339 | Chat on WhatsApp | https://wa.me/50671876500?text=Hello,%20I%20would%20like%20information%20about%20a%20property | Contact support | WhatsApp | https://wa.me/50671876500?text=Hello,%20I%20would%20like%20information%20about%20a%20property |
| 363 | ✕ | closeRateModal() | Read information / guest journey | general navigation | closeRateModal() |
| 385 | Select this rate — Proceed to checkout | confirmRate() | Read information / guest journey | general navigation | confirmRate() |
| 399 | Proceed to Checkout → | goCheckout() | Read information / guest journey | general navigation | goCheckout() |
| 400 | ✕ | closeStickyBar() | Read information / guest journey | general navigation | closeStickyBar() |

## En/host-consulting.html

| Line | Visible label | Current destination | User intent | Category | Recommended destination |
|---|---|---|---|---|---|
| 618 | [icon] | /En/ | Read information / guest journey | general navigation | /En/ |
| 622 | Why CR Stays | /En/#why-us | Read information / guest journey | general navigation | /En/#why-us |
| 623 | Services | /En/#services | Read information / guest journey | general navigation | /En/#services |
| 624 | Host Consulting | /En/host-consulting.html | Explore consulting | Host Consulting | /En/host-consulting.html |
| 625 | Meet Us | /En/#team | Read information / guest journey | general navigation | /En/#team |
| 626 | Locations | /En/#locations | Read information / guest journey | general navigation | /En/#locations |
| 629 | ES | /host-consulting.html | Explore consulting | Host Consulting | /host-consulting.html |
| 630 | Contact Us | https://wa.me/50671876500?text=Hi,%20I%27d%20like%20to%20know%20more%20about%20Host%20Consulting | Consulting information / specific package inquiry | WhatsApp | https://wa.me/50671876500?text=Hola%2C%20vi%20los%20servicios%20de%20Host%20Consulting%20de%20CR%20Stays%20y%20quisiera%20conocer%20cu%C3%A1l%20opci%C3%B3n%20puede%20ajustarse%20mejor%20a%20mi%20propiedad. |
| 631 | Schedule a Consultation | #schedule | Consulting information / specific package inquiry | Host Consulting | #schedule |
| 643 | Schedule a Consultation | #schedule | Consulting information / specific package inquiry | Host Consulting | #schedule |
| 644 | View Packages | #packages | Consulting information / specific package inquiry | Host Consulting | #packages |
| 731 | Book a Diagnostic | https://wa.me/50671876500?text=Hi,%20I%27d%20like%20to%20book%20the%20Diagnostic%20Session | Consulting information / specific package inquiry | WhatsApp | https://wa.me/50671876500?text=Hi,%20I%27d%20like%20to%20book%20the%20Diagnostic%20Session |
| 746 | Start With This Plan | https://wa.me/50671876500?text=Hi,%20I%27d%20like%20info%20on%20the%20Host%20Starter%20Plan | Consulting information / specific package inquiry | WhatsApp | https://wa.me/50671876500?text=Hi,%20I%27d%20like%20info%20on%20the%20Host%20Starter%20Plan |
| 762 | Request Launch Pro | https://wa.me/50671876500?text=Hi,%20I%27d%20like%20info%20on%20Launch%20Pro | Consulting information / specific package inquiry | WhatsApp | https://wa.me/50671876500?text=Hi,%20I%27d%20like%20info%20on%20Launch%20Pro |
| 776 | Check Availability | https://wa.me/50671876500?text=Hi,%20I%27d%20like%20info%20on%20Growth%20Advisory | Consulting information / specific package inquiry | WhatsApp | https://wa.me/50671876500?text=Hi,%20I%27d%20like%20info%20on%20Growth%20Advisory |
| 825 | See our Property Management service → | /En/#services | Read information / guest journey | general navigation | /En/#services |
| 899 | Schedule a Consultation | https://wa.me/50671876500?text=Hi,%20I%27d%20like%20to%20schedule%20a%20Host%20Consulting%20session | Consulting information / specific package inquiry | WhatsApp | https://wa.me/50671876500?text=Hi,%20I%27d%20like%20to%20schedule%20a%20Host%20Consulting%20session |
| 900 | Email Us | mailto:crstays@gmail.com | Email contact | general navigation | mailto:crstays@gmail.com |
| 917 | Why CR Stays | /En/#why-us | Read information / guest journey | general navigation | /En/#why-us |
| 918 | Property Management | /En/#services | Read information / guest journey | general navigation | /En/#services |
| 919 | Host Consulting | /En/host-consulting.html | Explore consulting | Host Consulting | /En/host-consulting.html |
| 920 | Meet Us | /En/#team | Read information / guest journey | general navigation | /En/#team |
| 921 | Private Consultation | #schedule | Consulting information / specific package inquiry | Host Consulting | #schedule |
| 927 | Book Direct | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 928 | View Properties | /En/#properties | Read information / guest journey | general navigation | /En/#properties |
| 929 | Locations | /En/#locations | Read information / guest journey | general navigation | /En/#locations |
| 946 | Instagram | # | Read information / guest journey | general navigation | # |
| 947 | [icon] | https://wa.me/50671876500 | Consulting information / specific package inquiry | WhatsApp | https://wa.me/50671876500?text=Hola%2C%20vi%20los%20servicios%20de%20Host%20Consulting%20de%20CR%20Stays%20y%20quisiera%20conocer%20cu%C3%A1l%20opci%C3%B3n%20puede%20ajustarse%20mejor%20a%20mi%20propiedad. |
| 953 | [icon] | https://wa.me/50671876500?text=Hi,%20I%27d%20like%20to%20know%20more%20about%20Host%20Consulting | Consulting information / specific package inquiry | WhatsApp | https://wa.me/50671876500?text=Hola%2C%20vi%20los%20servicios%20de%20Host%20Consulting%20de%20CR%20Stays%20y%20quisiera%20conocer%20cu%C3%A1l%20opci%C3%B3n%20puede%20ajustarse%20mejor%20a%20mi%20propiedad. |

## En/index.html

| Line | Visible label | Current destination | User intent | Category | Recommended destination |
|---|---|---|---|---|---|
| 536 | [icon] | /en/ | Read information / guest journey | general navigation | /En/ |
| 540 | Why CR Stays | #why-us | Read information / guest journey | general navigation | #why-us |
| 541 | Services | #services | Read information / guest journey | general navigation | #services |
| 542 | Analyzer | /analyzer/?lang=en | Analyze property | Analyzer | /analyzer/?lang=en |
| 543 | Host Consulting | /En/host-consulting.html | Explore consulting | Host Consulting | /En/host-consulting.html |
| 544 | Meet Us | #team | Read information / guest journey | general navigation | #team |
| 545 | Locations | #locations | Read information / guest journey | general navigation | #locations |
| 546 | Properties | #properties | Read information / guest journey | general navigation | #properties |
| 549 | Open navigation | button action | Read information / guest journey | general navigation | button action |
| 550 | WhatsApp | https://wa.me/50671876500 | Secondary owner contact | WhatsApp | https://wa.me/50671876500?text=Hola%2C%20visit%C3%A9%20CR%20Stays%20y%20quisiera%20conversar%20sobre%20la%20administraci%C3%B3n%20de%20mi%20propiedad. |
| 551 | ES | / | Read information / guest journey | general navigation | / |
| 552 | Contact Us | https://wa.me/50671876500 | Request property management consultation | Property Management | #contacto |
| 553 | Book Direct | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 556 | Analyze my property | /analyzer/?lang=en | Analyze property | Analyzer | /analyzer/?lang=en |
| 556 | Why CR Stays | #why-us | Read information / guest journey | general navigation | #why-us |
| 556 | Services | #services | Read information / guest journey | general navigation | #services |
| 556 | Host Consulting | /En/host-consulting.html | Explore consulting | Host Consulting | /En/host-consulting.html |
| 556 | Meet Us | #team | Read information / guest journey | general navigation | #team |
| 556 | Contact | #contact | Request property management consultation | Property Management | #contacto |
| 567 | I'm a property owner | #paths | Request property management consultation | Property Management | #contacto |
| 568 | Check Availability | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 590 | Prefer to keep running it yourself? Discover Host Consulting → | /En/host-consulting.html | Explore consulting | Host Consulting | /En/host-consulting.html |
| 614 | Contact Us Now | #contact | Request property management consultation | Property Management | #contacto |
| 638 | Schedule a Private Consultation | #contact | Request property management consultation | Property Management | #contacto |
| 667 | See how we work | #process | Read information / guest journey | general navigation | #process |
| 680 | Get Started | #contact | Request property management consultation | Property Management | #contacto |
| 715 | Schedule a Private Conversation | #contact | Request property management consultation | Property Management | #contacto |
| 781 | Discover Your Property's Potential | #contact | Request property management consultation | Property Management | #contacto |
| 803 | Is Your Property in Costa Rica? Let's Talk | #contact | Request property management consultation | Property Management | #contacto |
| 825 | Work With CR Stays | https://wa.me/50671876500?text=Hello,%20I%20have%20a%20property%20and%20would%20like%20to%20know%20more%20about%20CR%20Stays | Request property management consultation | Property Management | #contacto |
| 826 | Discover Host Consulting → | /En/host-consulting.html | Explore consulting | Host Consulting | /En/host-consulting.html |
| 840 | Check Availability | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 858 | Availability | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 867 | Availability | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 876 | Availability | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 880 | View All Properties | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 892 | Join Our Owners | #contact | Request property management consultation | Property Management | #contacto |
| 903 | WhatsApp +506 7187-6500 | https://wa.me/50671876500 | Secondary owner contact | WhatsApp | https://wa.me/50671876500?text=Hola%2C%20visit%C3%A9%20CR%20Stays%20y%20quisiera%20conversar%20sobre%20la%20administraci%C3%B3n%20de%20mi%20propiedad. |
| 904 | Email crstays@gmail.com | mailto:crstays@gmail.com | Email contact | general navigation | mailto:crstays@gmail.com |
| 918 | Send Request | handleForm() | Request property management consultation | Property Management | POST /api/consultation-leads |
| 937 | Why CR Stays | #why-us | Read information / guest journey | general navigation | #why-us |
| 938 | Services | #services | Read information / guest journey | general navigation | #services |
| 939 | Analyze my property | /analyzer/?lang=en | Analyze property | Analyzer | /analyzer/?lang=en |
| 940 | Host Consulting | /En/host-consulting.html | Explore consulting | Host Consulting | /En/host-consulting.html |
| 941 | How to Start | #process | Read information / guest journey | general navigation | #process |
| 942 | Meet Us | #team | Read information / guest journey | general navigation | #team |
| 943 | Private Consultation | #contact | Request property management consultation | Property Management | #contacto |
| 949 | Book Direct | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 950 | View Properties | #properties | Read information / guest journey | general navigation | #properties |
| 951 | San José | # | Read information / guest journey | general navigation | # |
| 952 | Zarcero | # | Read information / guest journey | general navigation | # |
| 953 | Atenas | # | Read information / guest journey | general navigation | # |
| 970 | [icon] | # | Read information / guest journey | general navigation | # |
| 971 | [icon] | https://wa.me/50671876500 | Secondary owner contact | WhatsApp | https://wa.me/50671876500?text=Hola%2C%20visit%C3%A9%20CR%20Stays%20y%20quisiera%20conversar%20sobre%20la%20administraci%C3%B3n%20de%20mi%20propiedad. |
| 977 | [icon] | https://wa.me/50671876500?text=Hello,%20I%20would%20like%20to%20know%20more%20about%20CR%20Stays | Secondary owner contact | WhatsApp | https://wa.me/50671876500?text=Hola%2C%20visit%C3%A9%20CR%20Stays%20y%20quisiera%20conversar%20sobre%20la%20administraci%C3%B3n%20de%20mi%20propiedad. |

## analyzer/index.html

| Line | Visible label | Current destination | User intent | Category | Recommended destination |
|---|---|---|---|---|---|
| 15 | CR Stays | / | Read information / guest journey | general navigation | / |
| 17 | Volver a CR Stays | / | Read information / guest journey | general navigation | / |
| 18 | ES | button action | Read information / guest journey | general navigation | button action |
| 18 | EN | button action | Read information / guest journey | general navigation | button action |
| 19 | Book Direct | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 32 | ANALIZAR MI PROPIEDAD | button action | Read information / guest journey | general navigation | button action |
| 43 | CR Stays | / | Read information / guest journey | general navigation | / |
| 43 | Contacto | https://wa.me/50671876500 | Contact support | WhatsApp | https://wa.me/50671876500 |

## analyzer/result.html

| Line | Visible label | Current destination | User intent | Category | Recommended destination |
|---|---|---|---|---|---|
| 8 | CR Stays | / | Read information / guest journey | general navigation | / |
| 8 | Analyzer | /analyzer/ | Analyze property | Analyzer | /analyzer/ |
| 8 | Contacto | /#contacto | Read information / guest journey | general navigation | /#contacto |
| 9 | CR Stays | / | Read information / guest journey | general navigation | / |

## analyzer/unsubscribe.html

| Line | Visible label | Current destination | User intent | Category | Recommended destination |
|---|---|---|---|---|---|
| 7 | CR Stays | / | Read information / guest journey | general navigation | / |

## check-in/index.html

| Line | Visible label | Current destination | User intent | Category | Recommended destination |
|---|---|---|---|---|---|
| 233 | STAYS Property Management | / | Read information / guest journey | general navigation | / |
| 240 | Need help? WhatsApp us | https://wa.me/50661240192 | Contact support | WhatsApp | https://wa.me/50661240192 |
| 255 | Start Check-In | #checkin-form | Read information / guest journey | general navigation | #checkin-form |
| 383 | Chat on WhatsApp +506 6124-0192 | https://wa.me/50661240192 | Contact support | WhatsApp | https://wa.me/50661240192 |
| 390 | Email Our Team crstays@gmail.com | mailto:crstays@gmail.com | Email contact | general navigation | mailto:crstays@gmail.com |
| 409 | crstays@gmail.com | mailto:crstays@gmail.com | Email contact | general navigation | mailto:crstays@gmail.com |
| 410 | +506 6124-0192 | https://wa.me/50661240192 | Contact support | WhatsApp | https://wa.me/50661240192 |
| 420 | STAYS Property Management | / | Read information / guest journey | general navigation | / |
| 432 | Our Services | /#services | Read information / guest journey | general navigation | /#services |
| 433 | Properties | /#properties | Read information / guest journey | general navigation | /#properties |
| 434 | Areas We Serve | /#areas | Read information / guest journey | general navigation | /#areas |
| 435 | About Us | /#team | Read information / guest journey | general navigation | /#team |
| 436 | Contact | /#contact | Read information / guest journey | general navigation | /#contact |
| 442 | Online Check-In | /check-in | Read information / guest journey | general navigation | /check-in |
| 443 | Browse Properties | /#properties | Read information / guest journey | general navigation | /#properties |
| 444 | WhatsApp Support | https://wa.me/50661240192 | Contact support | WhatsApp | https://wa.me/50661240192 |
| 445 | Email Us | mailto:crstays@gmail.com | Email contact | general navigation | mailto:crstays@gmail.com |
| 458 | Instagram | # | Read information / guest journey | general navigation | # |
| 465 | Facebook | # | Read information / guest journey | general navigation | # |
| 470 | WhatsApp | https://wa.me/50661240192 | Contact support | WhatsApp | https://wa.me/50661240192 |
| 480 | Chat on WhatsApp | https://wa.me/50661240192 | Contact support | WhatsApp | https://wa.me/50661240192 |

## crstays-booking.html

| Line | Visible label | Current destination | User intent | Category | Recommended destination |
|---|---|---|---|---|---|
| 715 | Ir a book.crstays.com | https://book.crstays.com/ | Read information / guest journey | general navigation | https://book.crstays.com/ |
| 721 | ← CR Stays | crstays-landing.html | Read information / guest journey | general navigation | crstays-landing.html |
| 723 | ← Volver al inicio | crstays-landing.html | Read information / guest journey | general navigation | crstays-landing.html |
| 790 | − | chG(-1) | Read information / guest journey | general navigation | chG(-1) |
| 792 | + | chG(1) | Read information / guest journey | general navigation | chG(1) |
| 795 | Verificar disponibilidad | doSearch() | Read information / guest journey | general navigation | doSearch() |
| 809 | ‹ | prevMonth() | Read information / guest journey | general navigation | prevMonth() |
| 810 | › | nextMonth() | Read information / guest journey | general navigation | nextMonth() |
| 851 | Ver todos los beneficios | # | Read information / guest journey | general navigation | # |
| 1519 | Ir al checkout | goToCheckout() | Read information / guest journey | general navigation | goToCheckout() |
| 1523 | ✕ | closeStickyBar2() | Read information / guest journey | general navigation | closeStickyBar2() |

## crstays-checkout.html

| Line | Visible label | Current destination | User intent | Category | Recommended destination |
|---|---|---|---|---|---|
| 367 | Go to book.crstays.com | https://book.crstays.com/ | Read information / guest journey | general navigation | https://book.crstays.com/ |
| 373 | CR Stays | crstays-booking.html | Read information / guest journey | general navigation | crstays-booking.html |
| 408 | Ingresa aquí | # | Read information / guest journey | general navigation | # |
| 577 | Términos & Condiciones | # | Read information / guest journey | general navigation | # |
| 577 | Política de Privacidad | # | Read information / guest journey | general navigation | # |
| 581 | Confirmar reserva | doBooking() | Read information / guest journey | general navigation | doBooking() |
| 604 | Editar | button action | Read information / guest journey | general navigation | button action |
| 605 | Eliminar | button action | Read information / guest journey | general navigation | button action |
| 630 | ↩ Volver | window.location='crstays-booking.html' | Read information / guest journey | general navigation | window.location='crstays-booking.html' |
| 633 | Reiniciar | window.location='crstays-booking.html' | Read information / guest journey | general navigation | window.location='crstays-booking.html' |
| 672 | Ir al pago | scrollToPayment() | Read information / guest journey | general navigation | scrollToPayment() |
| 676 | ✕ | closeStickyBar() | Read information / guest journey | general navigation | closeStickyBar() |
| 688 | Volver al inicio | window.location='crstays-booking.html' | Read information / guest journey | general navigation | window.location='crstays-booking.html' |

## host-consulting.html

| Line | Visible label | Current destination | User intent | Category | Recommended destination |
|---|---|---|---|---|---|
| 644 | [icon] | / | Read information / guest journey | general navigation | / |
| 648 | Por qué CR Stays | /#por-que | Read information / guest journey | general navigation | /#por-que |
| 649 | Servicios | /#servicios | Read information / guest journey | general navigation | /#servicios |
| 650 | Host Consulting | /host-consulting.html | Explore consulting | Host Consulting | /host-consulting.html |
| 651 | Conócenos | /#equipo | Read information / guest journey | general navigation | /#equipo |
| 652 | Zonas | /#zonas | Read information / guest journey | general navigation | /#zonas |
| 655 | EN | /En/host-consulting.html | Explore consulting | Host Consulting | /En/host-consulting.html |
| 656 | Habla con nosotros | https://wa.me/50671876500?text=Hola,%20quiero%20saber%20más%20sobre%20Host%20Consulting | Consulting information / specific package inquiry | WhatsApp | https://wa.me/50671876500?text=Hola%2C%20vi%20los%20servicios%20de%20Host%20Consulting%20de%20CR%20Stays%20y%20quisiera%20conocer%20cu%C3%A1l%20opci%C3%B3n%20puede%20ajustarse%20mejor%20a%20mi%20propiedad. |
| 657 | Agendar consulta | #agenda | Consulting information / specific package inquiry | Host Consulting | #agenda |
| 669 | Agendar una consulta | #agenda | Consulting information / specific package inquiry | Host Consulting | #agenda |
| 670 | Ver paquetes | #paquetes | Consulting information / specific package inquiry | Host Consulting | #paquetes |
| 757 | Agendar diagnóstico | https://wa.me/50671876500?text=Hola,%20quiero%20agendar%20el%20Diagnostic%20Session%20de%20Host%20Consulting | Consulting information / specific package inquiry | WhatsApp | https://wa.me/50671876500?text=Hola,%20quiero%20agendar%20el%20Diagnostic%20Session%20de%20Host%20Consulting |
| 772 | Empezar con este plan | https://wa.me/50671876500?text=Hola,%20quiero%20información%20sobre%20el%20Host%20Starter%20Plan | Consulting information / specific package inquiry | WhatsApp | https://wa.me/50671876500?text=Hola,%20quiero%20información%20sobre%20el%20Host%20Starter%20Plan |
| 788 | Solicitar Launch Pro | https://wa.me/50671876500?text=Hola,%20quiero%20información%20sobre%20Launch%20Pro | Consulting information / specific package inquiry | WhatsApp | https://wa.me/50671876500?text=Hola,%20quiero%20información%20sobre%20Launch%20Pro |
| 802 | Consultar disponibilidad | https://wa.me/50671876500?text=Hola,%20quiero%20información%20sobre%20Growth%20Advisory | Consulting information / specific package inquiry | WhatsApp | https://wa.me/50671876500?text=Hola,%20quiero%20información%20sobre%20Growth%20Advisory |
| 851 | Conoce nuestro servicio de Property Management → | /#servicios | Read information / guest journey | general navigation | /#servicios |
| 925 | Agendar una consulta | https://wa.me/50671876500?text=Hola,%20quiero%20agendar%20una%20consulta%20de%20Host%20Consulting | Consulting information / specific package inquiry | WhatsApp | https://wa.me/50671876500?text=Hola,%20quiero%20agendar%20una%20consulta%20de%20Host%20Consulting |
| 926 | Escribir por email | mailto:crstays@gmail.com | Email contact | general navigation | mailto:crstays@gmail.com |
| 943 | Por qué CR Stays | /#por-que | Read information / guest journey | general navigation | /#por-que |
| 944 | Property Management | /#servicios | Read information / guest journey | general navigation | /#servicios |
| 945 | Host Consulting | /host-consulting.html | Explore consulting | Host Consulting | /host-consulting.html |
| 946 | Conócenos | /#equipo | Read information / guest journey | general navigation | /#equipo |
| 947 | Consulta privada | #agenda | Consulting information / specific package inquiry | Host Consulting | #agenda |
| 953 | Book Direct | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 954 | Ver propiedades | /#propiedades | Read information / guest journey | general navigation | /#propiedades |
| 955 | Zonas | /#zonas | Read information / guest journey | general navigation | /#zonas |
| 972 | Instagram | # | Read information / guest journey | general navigation | # |
| 973 | [icon] | https://wa.me/50671876500 | Consulting information / specific package inquiry | WhatsApp | https://wa.me/50671876500?text=Hola%2C%20vi%20los%20servicios%20de%20Host%20Consulting%20de%20CR%20Stays%20y%20quisiera%20conocer%20cu%C3%A1l%20opci%C3%B3n%20puede%20ajustarse%20mejor%20a%20mi%20propiedad. |
| 979 | [icon] | https://wa.me/50671876500?text=Hola,%20quiero%20saber%20más%20sobre%20Host%20Consulting | Consulting information / specific package inquiry | WhatsApp | https://wa.me/50671876500?text=Hola%2C%20vi%20los%20servicios%20de%20Host%20Consulting%20de%20CR%20Stays%20y%20quisiera%20conocer%20cu%C3%A1l%20opci%C3%B3n%20puede%20ajustarse%20mejor%20a%20mi%20propiedad. |

## index.html

| Line | Visible label | Current destination | User intent | Category | Recommended destination |
|---|---|---|---|---|---|
| 570 | [icon] | # | Read information / guest journey | general navigation | # |
| 574 | Por qué CR Stays | #por-que | Read information / guest journey | general navigation | #por-que |
| 575 | Servicios | #servicios | Read information / guest journey | general navigation | #servicios |
| 576 | Analyzer | /analyzer/ | Analyze property | Analyzer | /analyzer/ |
| 577 | Host Consulting | /host-consulting.html | Explore consulting | Host Consulting | /host-consulting.html |
| 578 | Conócenos | #equipo | Read information / guest journey | general navigation | #equipo |
| 579 | Zonas | #zonas | Read information / guest journey | general navigation | #zonas |
| 580 | Propiedades | #propiedades | Read information / guest journey | general navigation | #propiedades |
| 583 | Abrir navegación | button action | Read information / guest journey | general navigation | button action |
| 584 | WhatsApp | https://wa.me/50671876500 | Secondary owner contact | WhatsApp | https://wa.me/50671876500?text=Hola%2C%20visit%C3%A9%20CR%20Stays%20y%20quisiera%20conversar%20sobre%20la%20administraci%C3%B3n%20de%20mi%20propiedad. |
| 585 | EN | /En/ | Read information / guest journey | general navigation | /En/ |
| 586 | Habla con nosotros | https://wa.me/50671876500 | Request property management consultation | Property Management | #contacto |
| 587 | Book Direct | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 590 | Analizar mi propiedad | /analyzer/ | Analyze property | Analyzer | /analyzer/ |
| 590 | Por qué CR Stays | #por-que | Read information / guest journey | general navigation | #por-que |
| 590 | Servicios | #servicios | Read information / guest journey | general navigation | #servicios |
| 590 | Host Consulting | /host-consulting.html | Explore consulting | Host Consulting | /host-consulting.html |
| 590 | Conócenos | #equipo | Read information / guest journey | general navigation | #equipo |
| 590 | Propiedades | #propiedades | Read information / guest journey | general navigation | #propiedades |
| 590 | Contacto | #contacto | Request property management consultation | Property Management | #contacto |
| 601 | Soy propietario | #caminos | Request property management consultation | Property Management | #contacto |
| 602 | Revisar disponibilidad | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 624 | ¿Prefieres seguir gestionando tu propiedad tú mismo? Conoce Host Consulting → | /host-consulting.html | Explore consulting | Host Consulting | /host-consulting.html |
| 648 | Contáctanos ya | #contacto | Request property management consultation | Property Management | #contacto |
| 672 | Agenda una consulta privada | #contacto | Request property management consultation | Property Management | #contacto |
| 701 | Ver cómo trabajamos | #proceso | Read information / guest journey | general navigation | #proceso |
| 714 | Comenzar ahora | #contacto | Request property management consultation | Property Management | #contacto |
| 749 | Agenda una conversación privada | #contacto | Request property management consultation | Property Management | #contacto |
| 815 | Quiero conocer el potencial de mi propiedad | #contacto | Request property management consultation | Property Management | #contacto |
| 837 | ¿Tu propiedad está en Costa Rica? Conversemos | #contacto | Request property management consultation | Property Management | #contacto |
| 859 | Contáctanos ya | https://wa.me/50671876500?text=Hola,%20tengo%20una%20propiedad%20y%20quiero%20conocer%20CR%20Stays | Request property management consultation | Property Management | #contacto |
| 860 | Conoce Host Consulting → | /host-consulting.html | Explore consulting | Host Consulting | /host-consulting.html |
| 874 | Revisar disponibilidad | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 892 | Disponibilidad | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 901 | Disponibilidad | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 910 | Disponibilidad | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 914 | Ver todas las propiedades | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 926 | Únete a nuestros propietarios | #contacto | Request property management consultation | Property Management | #contacto |
| 937 | WhatsApp +506 7187-6500 | https://wa.me/50671876500 | Secondary owner contact | WhatsApp | https://wa.me/50671876500?text=Hola%2C%20visit%C3%A9%20CR%20Stays%20y%20quisiera%20conversar%20sobre%20la%20administraci%C3%B3n%20de%20mi%20propiedad. |
| 938 | Email crstays@gmail.com | mailto:crstays@gmail.com | Email contact | general navigation | mailto:crstays@gmail.com |
| 952 | Enviar solicitud | handleForm() | Request property management consultation | Property Management | POST /api/consultation-leads |
| 971 | Por qué CR Stays | #por-que | Read information / guest journey | general navigation | #por-que |
| 972 | Servicios | #servicios | Read information / guest journey | general navigation | #servicios |
| 973 | Analizar mi propiedad | /analyzer/ | Analyze property | Analyzer | /analyzer/ |
| 974 | Host Consulting | /host-consulting.html | Explore consulting | Host Consulting | /host-consulting.html |
| 975 | Cómo empezar | #proceso | Read information / guest journey | general navigation | #proceso |
| 976 | Conócenos | #equipo | Read information / guest journey | general navigation | #equipo |
| 977 | Consulta privada | #contacto | Request property management consultation | Property Management | #contacto |
| 983 | Book Direct | https://book.crstays.com | Read information / guest journey | general navigation | https://book.crstays.com |
| 984 | Ver propiedades | #propiedades | Read information / guest journey | general navigation | #propiedades |
| 985 | San José | # | Read information / guest journey | general navigation | # |
| 986 | Zarcero | # | Read information / guest journey | general navigation | # |
| 987 | Atenas | # | Read information / guest journey | general navigation | # |
| 1004 | Instagram | # | Read information / guest journey | general navigation | # |
| 1005 | [icon] | https://wa.me/50671876500 | Secondary owner contact | WhatsApp | https://wa.me/50671876500?text=Hola%2C%20visit%C3%A9%20CR%20Stays%20y%20quisiera%20conversar%20sobre%20la%20administraci%C3%B3n%20de%20mi%20propiedad. |
| 1011 | [icon] | https://wa.me/50671876500 | Secondary owner contact | WhatsApp | https://wa.me/50671876500?text=Hola%2C%20visit%C3%A9%20CR%20Stays%20y%20quisiera%20conversar%20sobre%20la%20administraci%C3%B3n%20de%20mi%20propiedad. |

## Dynamic Analyzer actions (preserved)

`analyzer/snapshot.js`: management button opens the existing deeper-review lead form when an analysis email is available; otherwise links to `/#contacto`. Consulting links to `/host-consulting.html`. Analyze / retry / another-property actions and persistent result links are unchanged. No Analyzer-specific WhatsApp message was found in current main; its existing plain WhatsApp footer link is preserved exactly.

## Findings and decisions

- Homepage owner intent converges on #contacto, including owner entry, header contact and team CTA. WhatsApp icons/contact method remain secondary.
- EN uses #contact today; keep it as a compatibility anchor and use #contacto for new links. Fix EN logo /en/ to actual /En/ directory.
- Both forms currently call alert without submission. Replace with validated backend submission.
- Host Consulting package-specific WhatsApp messages remain intact. General header/footer/floating WhatsApp entries gain the requested consulting source message; scheduling anchors and service cross-links are preserved.
- Placeholder social/location links (#), and older guest-page navigation references are documented in the inventory, outside the owner-capture implementation. Host Consulting Instagram # is an unresolved placeholder; a verified account URL is not available in source.
- Guest booking, checkout and check-in actions are not Property Management leads. Preserve their booking/support destinations.
- Homepage has no GA4 loader. Reuse the public Analyzer config measurement ID and initialize only when configured; never send form values or destinations to analytics.
