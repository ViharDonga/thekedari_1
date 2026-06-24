import { Injectable, signal } from '@angular/core';

export type SupportedLanguage = 'en' | 'hi' | 'gu';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // Current Language Signal (Default to English)
  public currentLanguage = signal<SupportedLanguage>('en');

  // Current Theme Signal (Default to Dark)
  public currentTheme = signal<'dark' | 'light'>('dark');

  // Set Theme Method
  public setTheme(theme: 'dark' | 'light') {
    this.currentTheme.set(theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }

  // Translation Dictionary
  private translations: Record<string, Record<SupportedLanguage, string>> = {
    // App Header & Tabs
    'app_title': { en: 'Thekedari', hi: 'ठेकेदारी', gu: 'ઠેકેદારી' },
    'sub_title': { en: 'Smart Contractor Hub', hi: 'स्मार्ट ठेकेदार हब', gu: 'સ્માર્ટ કોન્ટ્રાક્ટર હબ' },
    'tab_dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड', gu: 'ડેશબોર્ડ' },
    'tab_dashboard_short': { en: 'Home', hi: 'होम', gu: 'હોમ' },
    'tab_labour': { en: 'Labour & Attendance', hi: 'मजदूर और हाजिरी', gu: 'મજૂર અને હાજરી' },
    'tab_labour_short': { en: 'Labour', hi: 'मजदूर', gu: 'મજૂર' },
    'tab_materials': { en: 'Materials & Site', hi: 'सामग्री और साइट', gu: 'સામગ્રી અને સાઇટ' },
    'tab_materials_short': { en: 'Stock', hi: 'सामान', gu: 'સ્ટોક' },
    
    // Settings Modal
    'settings_title': { en: 'App Settings', hi: 'ऐप सेटिंग्स', gu: 'એપ સેટિંગ્સ' },
    'select_language': { en: 'Select App Language', hi: 'ऐप की भाषा चुनें', gu: 'એપની ભાષા પસંદ કરો' },
    'theme_section': { en: 'Theme Mode', hi: 'थीम मोड', gu: 'થીમ મોડ' },
    'light_theme': { en: 'Light Theme', hi: 'लाइट थीम', gu: 'લાઇટ થીમ' },
    'dark_theme': { en: 'Dark Theme', hi: 'डार्क थीम', gu: 'ડાર્ક થીમ' },
    'english': { en: 'English', hi: 'अंग्रेजी (English)', gu: 'અંગ્રેજી (English)' },
    'hindi': { en: 'Hindi (हिंदी)', hi: 'हिंदी (हिंदी)', gu: 'હિન્દી (हिंदी)' },
    'gujarati': { en: 'Gujarati (ગુજરાતી)', hi: 'गुजराती (ગુજરાતી)', gu: 'ગુજરાતી (ગુજરાતી)' },
    'profile_section': { en: 'Business Profile', hi: 'व्यवसाय प्रोफ़ाइल', gu: 'બિઝનેસ પ્રોફાઇલ' },
    'biz_name': { en: 'Business Name', hi: 'व्यवसाय का नाम', gu: 'વેપારનું નામ' },
    'contractor_license': { en: 'Contractor License', hi: 'ठेकेदारी लाइसेंस', gu: 'કોન્ટ્રાક્ટર લાયસન્સ' },
    'verified': { en: 'Verified', hi: 'सत्यापित', gu: 'વેરીફાઈડ' },
    'backup_sync': { en: 'Auto Cloud Sync', hi: 'ऑटो क्लाउड सिंक', gu: 'ઓટો ક્લાઉડ સિંક' },
    'app_version': { en: 'App Version', hi: 'ऐप का संस्करण', gu: 'એપ સંસ્કરણ' },
    'done': { en: 'Done', hi: 'सहेजें', gu: 'થઈ ગયું' },

    // Dashboard Tab 1 Labels
    'active_site': { en: 'Active Site', hi: 'सक्रिय साइट', gu: 'સક્રિય સાઇટ' },
    'budget_utilization': { en: 'Budget Utilization', hi: 'बजट उपयोग', gu: 'બજેટ ઉપયોગ' },
    'consumed': { en: 'Consumed', hi: 'उपयोग किया गया', gu: 'વપરાયેલ' },
    'supervisor': { en: 'Supervisor', hi: 'सुपरवाइजर', gu: 'સુપરવાઇઝર' },
    'quick_actions': { en: 'Quick Actions', hi: 'त्वरित कार्य', gu: 'ઝડપી કાર્યો' },
    'material_delivery': { en: 'Material Delivery', hi: 'सामग्री प्राप्ति', gu: 'સામગ્રી વિતરણ' },
    'record_materials': { en: 'Record materials received', hi: 'प्राप्त सामग्री दर्ज करें', gu: 'પ્રાપ્ત સામગ્રીની નોંધ કરો' },
    'wage_payment': { en: 'Wage Payment', hi: 'मजदूरी भुगतान', gu: 'મજૂરી ચૂકવણી' },
    'log_payments': { en: 'Log payments/advances', hi: 'भुगतान/अग्रिम दर्ज करें', gu: 'ચુકવણી/એડવાન્સ નોંધી લો' },
    'live_site_stats': { en: 'Live Site Stats', hi: 'साइट के लाइव आंकड़े', gu: 'સાઇટના લાઇવ આંકડા' },
    'workers_on_duty': { en: 'Workers On Duty', hi: 'काम पर मौजूद मजदूर', gu: 'કામ પર હાજર મજૂર' },
    'today_accrued_wages': { en: 'Today\'s Accrued Wages', hi: 'आज की कुल मजदूरी', gu: 'આજની કુલ મજૂરી' },
    'based_on_roll': { en: 'Based on active roll', hi: 'हाजिरी के आधार पर', gu: 'હાજરીના આધારે' },
    'expense_allocation': { en: 'Expense Allocation Summary', hi: 'खर्च का सारांश', gu: 'ખર્ચની વિગતવાર વિગત' },
    'labour_wages': { en: 'Labour Wages', hi: 'मजदूरों की मजदूरी', gu: 'મજૂરની મજૂરી' },
    'materials_inventory': { en: 'Materials Inventory', hi: 'सामग्री स्टॉक', gu: 'સામગ્રી સ્ટોક' },
    'machinery_misc': { en: 'Machinery & Miscellaneous', hi: 'मशीनरी और अन्य', gu: 'મશીનરી અને અન્ય' },
    'recent_ledger': { en: 'Recent Site Ledger', hi: 'हालिया बहीखाता', gu: 'તાજેતરની ખાતાવહી' },
    'today': { en: 'Today', hi: 'आज', gu: 'આજે' },

    // Labour Tab 2 Labels
    'roster_attendance': { en: 'Roster & Attendance', hi: 'मजदूर सूची और हाजिरी', gu: 'મજૂર યાદી અને હાજરી' },
    'roll_call_ledger': { en: 'Daily Roll Call Ledger', hi: 'दैनिक हाजिरी रजिस्टर', gu: 'દૈનિક હાજરી રજીસ્ટર' },
    'search_placeholder': { en: 'Search worker name or trade...', hi: 'मजदूर का नाम या काम खोजें...', gu: 'મજૂરનું નામ અથવા કામ શોધો...' },
    'filter_site': { en: 'Filter Site', hi: 'साइट चुनें', gu: 'સાઇટ પસંદ કરો' },
    'filter_trade': { en: 'Filter Trade', hi: 'श्रेणी चुनें', gu: 'શ્રેણી પસંદ કરો' },
    'all_sites': { en: 'All Sites', hi: 'सभी साइटें', gu: 'બધી સાઇટો' },
    'all_trades': { en: 'All Trades', hi: 'सभी श्रेणियां', gu: 'બધી શ્રેણીઓ' },
    'total': { en: 'Total', hi: 'कुल', gu: 'કુલ' },
    'workers': { en: 'Workers', hi: 'मजदूर', gu: 'મજૂરો' },
    'present': { en: 'Present', hi: 'उपस्थित', gu: 'હાજર' },
    'absent': { en: 'Absent', hi: 'अनुपस्थित', gu: 'ગેરહાજર' },
    'due_wages': { en: 'Due Wages', hi: 'बकाया मजदूरी', gu: 'બાકી મજૂરી' },
    'adv': { en: 'Adv', hi: 'अग्रिम', gu: 'એડવાન્સ' },
    'today_mark': { en: 'Today\'s Mark', hi: 'आज की हाजिरी', gu: 'આજની હાજરી' },
    'attendance_date': { en: 'Attendance Date', hi: 'हाजिरी की तारीख', gu: 'હાજરી તારીખ' },

    // Labour Details Ledger Modal
    'labour_ledger': { en: 'Labour Ledger', hi: 'मजदूर बहीखाता', gu: 'મજૂર ખાતાવહી' },
    'wages_outstanding': { en: 'Wages Outstanding', hi: 'कुल बकाया मजदूरी', gu: 'કુલ બાકી મજૂરી' },
    'advance_paid': { en: 'Advance Cash Paid', hi: 'दिया गया अग्रिम', gu: 'ચૂકવેલ એડવાન્સ' },
    'record_payout': { en: 'Record Worker Payout', hi: 'भुगतान दर्ज करें', gu: 'ચુકવણીની રકમ નોંધો' },
    'clear_wages': { en: 'Clear Outstanding Wages', hi: 'बकाया मजदूरी चुकाएं', gu: 'બાકી મજૂરી ચૂકવો' },
    'ledger_history': { en: 'Ledger History', hi: 'बहीखाता इतिहास', gu: 'ખાતાવહીનો ઇતિહાસ' },
    'no_past_tx': { en: 'No past transactions recorded for this worker.', hi: 'इस मजदूर के लिए कोई पुराना लेनदेन दर्ज नहीं है।', gu: 'આ મજૂર માટે કોઈ જૂના વ્યવહારો નોંધાયેલા નથી.' },

    // Materials Tab 3 Labels
    'materials_stock': { en: 'Materials & Inventory', hi: 'सामग्री और स्टॉक', gu: 'સામગ્રી અને સ્ટોક' },
    'supply_tracker': { en: 'Site Supply Tracker', hi: 'साइट आपूर्ति ट्रैकर', gu: 'સાઇટ સપ્લાય ટ્રેકર' },
    'current_site': { en: 'Current Site', hi: 'वर्तमान साइट', gu: 'વર્તમાન સાઇટ' },
    'log_delivery': { en: 'Log Delivery', hi: 'डिलीवरी दर्ज करें', gu: 'ડિલિવરી નોંધો' },
    'stock_levels': { en: 'Current Stock Levels', hi: 'वर्तमान स्टॉक स्तर', gu: 'વર્તમાન સ્ટોક સ્તર' },
    'supplier_receipts': { en: 'Recent Supplier Receipts', hi: 'हालिया सप्लायर रसीदें', gu: 'તાજેતરની સપ્લાયર રસીદો' },
    'no_deliveries': { en: 'No materials delivered to this site yet.', hi: 'इस साइट पर अभी तक कोई सामग्री वितरित नहीं हुई है।', gu: 'આ સાઇટ પર હજુ સુધી કોઈ સામગ્રી પહોંચાડવામાં આવી નથી.' },

    // Common Modal Inputs
    'material_modal_title': { en: 'Record Material Delivery', hi: 'सामग्री प्राप्ति दर्ज करें', gu: 'સામગ્રી ડિલિવરી નોંધો' },
    'material_desc': { en: 'Log cement, steel, sand, aggregate, or bricks arriving at the construction site. This updates current site inventory levels and matches accounting.', hi: 'साइट पर आने वाले सीमेंट, स्टील, रेत या ईंटों की जानकारी दर्ज करें। यह साइट के स्टॉक और खातों को अपडेट करता है।', gu: 'સાઇટ પર આવતા સિમેન્ટ, સ્ટીલ, રેતી અથવા ઇંટોની માહિતી દાખલ કરો. આ સાઇટના સ્ટોક અને ખાતાઓને અપડેટ કરે છે.' },
    'material_name': { en: 'Material Name / Type', hi: 'सामग्री का नाम / प्रकार', gu: 'સામગ્રીનું નામ / પ્રકાર' },
    'supplier_name': { en: 'Supplier Name', hi: 'सप्लायर का नाम', gu: 'સપ્લાયરનું નામ' },
    'qty': { en: 'Quantity', hi: 'मात्रा', gu: 'જથ્થો' },
    'unit': { en: 'Unit', hi: 'इकाई', gu: 'એકમ' },
    'rate_per_unit': { en: 'Rate Per Unit (₹)', hi: 'दर प्रति इकाई (₹)', gu: 'એકમ દીઠ દર (₹)' },
    'cancel': { en: 'Cancel', hi: 'रद्द करें', gu: 'રદ કરો' },
    'receive_material': { en: 'Receive Material', hi: 'सामग्री प्राप्त करें', gu: 'સામગ્રી મેળવો' },
    'save_receipt': { en: 'Save Receipt', hi: 'रसीद सहेजें', gu: 'રસીદ સાચવો' },

    'payment_modal_title': { en: 'Record Wage Payment', hi: 'मजदूरी भुगतान दर्ज करें', gu: 'મજૂરી ચૂકવણી નોંધો' },
    'payment_desc': { en: 'Record a daily payment or cash advance paid out to active workers. This decrements their pending balance due.', hi: 'मजदूरों को किए गए दैनिक भुगतान या अग्रिम राशि दर्ज करें। इससे उनका बकाया बैलेंस कम हो जाता है।', gu: 'મજૂરોને ચૂકવેલ દૈનિક રકમ અથવા એડવાન્સની નોંધ કરો. આનાથી તેમની બાકી રકમ ઓછી થશે.' },
    'select_worker': { en: 'Select Worker', hi: 'मजदूर चुनें', gu: 'મજૂર પસંદ કરો' },
    'payment_amt': { en: 'Payment Amount (₹)', hi: 'भुगतान राशि (₹)', gu: 'ચુકવણીની રકમ (₹)' },
    'payment_mode': { en: 'Payment Mode', hi: 'भुगतान का प्रकार', gu: 'ચુકવણીનો પ્રકાર' },
    'record_payment': { en: 'Record Payment', hi: 'भुगतान सहेजें', gu: 'ચુકવણી સાચવો' },

    'ot_title': { en: 'Specify Overtime Hours', hi: 'ओवरटाइम के घंटे दर्ज करें', gu: 'ઓવરટાઇમના કલાકો લખો' },
    'ot_desc': { en: 'Enter OT hours and extra pay amount for this day.', hi: 'इस दिन के लिए ओटी घंटे और अतिरिक्त राशि दर्ज करें।', gu: 'આ દિવસ માટે ઓટી કલાકો અને વધારાની રકમ લખો.' },
    'ot_hours': { en: 'Overtime Hours', hi: 'ओवरटाइम के घंटे', gu: 'ઓવરટાઇમના કલાકો' },
    'ot_amount': { en: 'OT Extra Pay (₹)', hi: 'ओटी अतिरिक्त वेतन (₹)', gu: 'ઓટી વધારાનું વેતન (₹)' },
    'ot_paid': { en: 'OT Paid', hi: 'ओटी भुगतान', gu: 'ઓટી ચૂકવણી' },
    'ot_total_day': { en: 'Total Day Pay', hi: 'कुल दिन वेतन', gu: 'કુલ દિવસ વેતન' },
    'ot_per_hour': { en: 'per hour', hi: 'प्रति घंटा', gu: 'પ્રતિ કલાક' },
    'edit_day_attendance': { en: 'Edit Day Attendance', hi: 'दिन की हाजिरी संपादित करें', gu: 'દિવસની હાજરી એડિટ કરો' },
    'day_wage_amount': { en: 'Day Wage Amount (₹)', hi: 'दिन का वेतन (₹)', gu: 'દિવસનું વેતન (₹)' },
    'day_payment_amount': { en: 'Payment for This Day (₹)', hi: 'इस दिन का भुगतान (₹)', gu: 'આ દિવસની ચૂકવણી (₹)' },
    'day_wage_hint': { en: 'Set exact wage for this day, e.g. ₹750 for harder work.', hi: 'इस दिन का सही वेतन लिखें, जैसे कठिन काम के लिए ₹750।', gu: 'આ દિવસનું ચોક્કસ વેતન લખો, જેમ સખત કામ માટે ₹750.' },
    'save_day_edit': { en: 'Save Day', hi: 'दिन सहेजें', gu: 'દિવસ સાચવો' },
    'attendance_mark': { en: 'Mark', hi: 'हाजिरी', gu: 'હાજરી' },
    'save_ot': { en: 'Save Overtime', hi: 'ओवरटाइम सहेजें', gu: 'ઓવરટાઇમ સાચવો' },
    
    // Status Badges
    'low_stock': { en: 'Low Stock', hi: 'कम स्टॉक', gu: 'ઓછો સ્ટોક' },
    'in_stock': { en: 'In Stock', hi: 'स्टॉक में', gu: 'સ્ટોકમાં' },
    'active': { en: 'Active', hi: 'सक्रिय', gu: 'સક્રિય' },
    'delivered': { en: 'Delivered', hi: 'वितरित', gu: 'ડિલિવર થયેલ' },
    'pending': { en: 'Pending', hi: 'लंबित', gu: 'બાકી' },
    
    // Reports and rentals
    'tab_reports': { en: 'Reports', hi: 'रिपोर्ट्स', gu: 'રિપોર્ટસ' },
    'tab_reports_short': { en: 'Reports', hi: 'रिपोर्ट', gu: 'રિપોર્ટ' },
    'labour_report': { en: 'Labour Report', hi: 'मजदूर रिपोर्ट', gu: 'મજૂર રિપોર્ટ' },
    'rental_materials': { en: 'Rented Materials', hi: 'किराए की सामग्री', gu: 'ભાડાની સામગ્રી' },
    'rent_rate': { en: 'Rent Rate', hi: 'किराया दर', gu: 'ભાડાનો દર' },
    'rent_per_day': { en: 'Rent / Day', hi: 'किराया / दिन', gu: 'ભાડું / દિવસ' },
    'rent_cost': { en: 'Accrued Rent', hi: 'कुल किराया', gu: 'કુલ ભાડું' },
    'active_rentals': { en: 'Active Rentals', hi: 'सक्रिय किराए की सामग्री', gu: 'સક્રિય ભાડાની સામગ્રી' },
    'returned_rentals': { en: 'Returned Rentals', hi: 'लौटाई गई सामग्री', gu: 'પરત કરેલ સામગ્રી' },
    'log_rental': { en: 'Log Rental', hi: 'किराया दर्ज करें', gu: 'ભાડું નોંધો' },
    'return_date': { en: 'Return Date', hi: 'वापसी की तारीख', gu: 'પરત તારીખ' },
    'start_date': { en: 'Start Date', hi: 'शुरू होने की तारीख', gu: 'શરૂઆતની તારીખ' },
    'material_flow_type': { en: 'Material Transaction Type', hi: 'सामग्री लेनदेन प्रकार', gu: 'સામગ્રી વ્યવહાર પ્રકાર' },
    'purchase': { en: 'One-time Purchase', hi: 'एक-बारगी खरीद (Purchase)', gu: 'એકવારની ખરીદી (Purchase)' },
    'rental': { en: 'Rental Equipment', hi: 'किराए पर सामान (Rental)', gu: 'ભાડા પર સામાન (Rental)' },
    'size': { en: 'Size / Dimension', hi: 'आकार / माप', gu: 'કદ / માપ' },
    'total_spent_report': { en: 'All Sites Spent Report', hi: 'सभी साइटों का खर्च रिपोर्ट', gu: 'બધી સાઇટોનો ખર્ચ અહેવાલ' },
    'individual_spent_report': { en: 'Individual Site Report', hi: 'एकल साइट रिपोर्ट', gu: 'એકલ સાઇટ અહેવાલ' },
    'spent_wages': { en: 'Wages Paid', hi: 'मजदूरी भुगतान', gu: 'ચૂકવેલ મજૂરી' },
    'spent_materials': { en: 'Material Costs', hi: 'सामग्री खर्च', gu: 'સામગ્રી ખર્ચ' },
    'spent_rentals': { en: 'Rental Costs', hi: 'किराया खर्च', gu: 'ભાડાનો ખર્ચ' },
    'other_expenses': { en: 'Other Expenses', hi: 'अन्य खर्च', gu: 'અન્ય ખર્ચ' },
    'total_spent': { en: 'Total Spent', hi: 'कुल खर्च', gu: 'કુલ ખર્ચ' },
    'budget': { en: 'Budget', hi: 'बजट', gu: 'બજેટ' },
    'remaining': { en: 'Remaining', hi: 'शेष', gu: 'બાકી' },
    'cost_breakdown': { en: 'Cost Breakdown', hi: 'लागत का विवरण', gu: 'ખર્ચનું વિવરણ' },
    'spent_breakdown_label': { en: 'Expense Analytics', hi: 'खर्च विश्लेषण', gu: 'ખર્ચ વિશ્લેષણ' },
    'no_rentals_tracked': { en: 'No rented equipment on this site yet.', hi: 'इस साइट पर अभी कोई किराए का सामान नहीं।', gu: 'આ સાઇટ પર હજી ભાડાનું સાધન નથી.' },
    'site_name': { en: 'Site Name', hi: 'साइट का नाम', gu: 'સાઇટનું નામ' },
    'action_return': { en: 'Return Material', hi: 'सामग्री लौटाएं', gu: 'સામાન પરત કરો' },
    'print_report': { en: 'Create PDF / Print', hi: 'पीडीएफ बनाएं / प्रिंट', gu: 'પીડીએફ બનાવો / પ્રિન્ટ' },
    'all_sites_summary': { en: 'All Sites Summary', hi: 'सभी साइटों का सारांश', gu: 'બધી સાઇટોનો સારાંશ' },
    'site_detail_report': { en: 'Site Detail Report', hi: 'साइट विवरण रिपोर्ट', gu: 'સાઇટ વિગતવાર રિપોર્ટ' },
    'select_site_report': { en: 'Select Site to View Report', hi: 'रिपोर्ट देखने के लिए साइट चुनें', gu: 'રિપોર્ટ જોવા માટે સાઇટ પસંદ કરો' },
    'equipment_rented': { en: 'Equipment on Rent', hi: 'किराए पर दिया गया सामान', gu: 'ભાડે આપેલ સાધનો' },
    'days_on_rent': { en: 'Days on Rent', hi: 'किराए के दिन', gu: 'ભાડાના દિવસો' },
    'custom_material': { en: 'Custom Material', hi: 'कस्टम सामग्री', gu: 'કસ્ટમ સામગ્રી' },
    'common_materials': { en: 'Common Materials', hi: 'सामान्य सामग्री', gu: 'સામાન્ય સામગ્રી' },
    'common_rentals': { en: 'Common Rental Items', hi: 'सामान्य किराए की सामग्री', gu: 'સામાન્ય ભાડાની સામગ્રી' },
    'material_flow_label': { en: 'Transaction Type', hi: 'लेनदेन का प्रकार', gu: 'વ્યવહાર પ્રકાર' },
    
    // Monthly Attendance & Advance Booking / Day book keys
    'monthly_attendance_grid': { en: 'Monthly Attendance - June 2026', hi: 'मासिक हाजिरी - जून 2026', gu: 'માસિક હાજરી - જૂન 2026' },
    'sub_tab_roster': { en: 'Roster & Roll Call', hi: 'हाजिरी रजिस्टर', gu: 'હાજરી રજીસ્ટર' },
    'sub_tab_bookings': { en: 'Advance Bookings', hi: 'अग्रिम बुकिंग', gu: 'એડવાન્સ બુકિંગ' },
    'sub_tab_daybook': { en: 'Advance Day Book', hi: 'अग्रिम रोकड़ बही', gu: 'એડવાન્સ રોકડ મેળ' },
    'book_labour_btn': { en: 'Book Labour', hi: 'मजदूर बुक करें', gu: 'મજૂર બુક કરો' },
    'booking_date': { en: 'Booking Date', hi: 'बुकिंग की तारीख', gu: 'બુકિંગ તારીખ' },
    'remarks': { en: 'Remarks / Work Description', hi: 'टिप्पणी / कार्य विवरण', gu: 'નોંધ / કામની વિગત' },
    'no_bookings_tracked': { en: 'No future bookings logged.', hi: 'कोई अग्रिम बुकिंग दर्ज नहीं है।', gu: 'કોઈ એડવાન્સ બુકિંગ નોંધાયેલ નથી.' },
    'no_adv_payments': { en: 'No advance payments recorded today.', hi: 'आज कोई अग्रिम भुगतान दर्ज नहीं है।', gu: 'આજે કોઈ એડવાન્સ ચુકવણી નોંધાયેલ નથી.' },
    'cancel_booking': { en: 'Cancel Booking', hi: 'बुकिंग रद्द करें', gu: 'બુકિંગ રદ કરો' },
    'worker_bookings_title': { en: 'Labour Advance Bookings', hi: 'लेबर एडवांस बुकिंग रजिस्टर', gu: 'લેબર એડવાન્સ બુકિંગ રજીસ્ટર' },
    'advance_cash_daybook': { en: 'Advance Payments Day Book', hi: 'अग्रिम भुगतान बहीखाता', gu: 'એડવાન્સ ચુકવણી ખાતાવહી' },
    'booking_modal_title': { en: 'Create Advance Booking', hi: 'अग्रिम बुकिंग बनाएं', gu: 'એડવાન્સ બુકિંગ બનાવો' },
    'add_labour': { en: 'Add Labour', hi: 'नया मजदूर जोड़ें', gu: 'નવો મજૂર ઉમેરો' },
    'employment_type': { en: 'Employment Type', hi: 'रोजगार का प्रकार', gu: 'રોજગારનો પ્રકાર' },
    'permanent': { en: 'Permanent', hi: 'स्थायी', gu: 'કાયમી' },
    'casual': { en: 'Casual (On-Call)', hi: 'अस्थायी (कॉल पर)', gu: 'કામચલાઉ (કોલ પર)' },
    'call_to_work': { en: 'Call to Work', hi: 'काम पर बुलाएं', gu: 'કામ પર બોલાવો' },
    'release_btn': { en: 'Cancel Call', hi: 'बुलावा रद्द करें', gu: 'બોલાવવાનું રદ કરો' },
    'worker_added_success': { en: 'Worker added successfully.', hi: 'मजदूर सफलतापूर्वक जोड़ दिया गया है।', gu: 'મજૂર સફળતાપૂર્વક ઉમેરવામાં આવ્યો છે.' },
    'enter_worker_details': { en: 'Enter Worker Details', hi: 'मजदूर का विवरण भरें', gu: 'મજૂરની વિગતો ભરો' },
    'worker_name': { en: 'Worker Name', hi: 'मजदूर का नाम', gu: 'મજૂરનું નામ' },
    'daily_wage_rate': { en: 'Daily Rate (₹)', hi: 'दैनिक दर (₹)', gu: 'દૈનિક દર (₹)' },
    'edit_daily_wage': { en: 'Edit Daily Wage', hi: 'दैनिक वेतन बदलें', gu: 'દૈનિક વેતન બદલો' },
    'edit_daily_wage_desc': { en: 'Update rate when work is harder or rate changes. Past attendance is recalculated.', hi: 'कठिन काम या नई दर पर अपडेट करें। पुरानी हाजिरी पर भी लागू होगा।', gu: 'સખત કામ અથવા નવી દર માટે અપડેટ કરો. જૂની હાજરી પર પણ લાગુ થશે.' },
    'save_changes': { en: 'Save Changes', hi: 'सहेजें', gu: 'સાચવો' },
    'edit_site': { en: 'Edit Site', hi: 'साइट संपादित करें', gu: 'સાઇટ એડિટ કરો' },
    'wage_updated': { en: 'Daily wage updated successfully', hi: 'दैनिक वेतन अपडेट हो गया', gu: 'દૈનિક વેતન અપડેટ થયું' },
    'site_updated': { en: 'Site updated successfully', hi: 'साइट अपडेट हो गई', gu: 'સાઇટ અપડેટ થઈ' },
    'phone_number': { en: 'Phone Number', hi: 'फ़ोन नंबर', gu: 'ફોન નંબર' },
    'select_role': { en: 'Select Role / Trade', hi: 'श्रेणी / काम चुनें', gu: 'શ્રેણી / કામ પસંદ કરો' },
    'install_app_banner_title': { en: 'Install Thekedari App', hi: 'Thekedari ऐप इंस्टॉल करें', gu: 'Thekedari એપ ઇન્સ્ટોલ કરો' },
    'install_app_banner_desc': { en: 'Download the official Android app — installs like any other app on your phone.', hi: 'आधिकारिक Android ऐप डाउनलोड करें — फ़ोन पर किसी भी ऐप की तरह इंस्टॉल होगा।', gu: 'અધિકૃત Android એપ ડાઉનલોડ કરો — ફોન પર બીજી કોઈ પણ એપ જેવી ઇન્સ્ટોલ થશે.' },
    'install_app_now': { en: 'Install App', hi: 'ऐप इंस्टॉल करें', gu: 'એપ ઇન્સ્ટોલ કરો' },
    'install_app_steps': { en: 'Tap Install App → open the downloaded file → tap Install. Allow installs from Chrome if asked.', hi: 'Install App दबाएँ → डाउनलोड की फ़ाइल खोलें → Install दबाएँ। Chrome से इंस्टॉल की अनुमति दें।', gu: 'Install App દબાવો → ડાઉનલોડ ફાઇલ ખોલો → Install દબાવો. Chrome માંથી ઇન્સ્ટોલની પરવાનગી આપો.' },
    'update_available_title': { en: 'App update available', hi: 'ऐप अपडेट उपलब्ध', gu: 'એપ અપડેટ ઉપલબ્ધ' },
    'update_available_desc': { en: 'A new version is ready. Download and install to get the latest features.', hi: 'नया संस्करण तैयार है। नवीनतम सुविधाओं के लिए डाउनलोड करके इंस्टॉल करें।', gu: 'નવું વર્ઝન તૈયાર છે. નવીનતમ સુવિધાઓ માટે ડાઉનલોડ કરી ઇન્સ્ટોલ કરો.' },
    'update_now': { en: 'Update Now', hi: 'अभी अपडेट करें', gu: 'હમણાં અપડેટ કરો' },

    // Login & Auth
    'login_title': { en: 'Sign In', hi: 'लॉग इन करें', gu: 'લોગ ઇન કરો' },
    'username': { en: 'Username', hi: 'यूज़रनेम', gu: 'યુઝરનેમ' },
    'password': { en: 'Password', hi: 'पासवर्ड', gu: 'પાસવર્ડ' },
    'login_button': { en: 'Login', hi: 'लॉग इन', gu: 'લોગ ઇન' },
    'logging_in': { en: 'Logging in...', hi: 'लॉग इन हो रहा है...', gu: 'લોગ ઇન થઈ રહ્યું છે...' },
    'login_failed': { en: 'Login failed. Check username and password.', hi: 'लॉग इन विफल। यूज़रनेम और पासवर्ड जांचें।', gu: 'લોગ ઇન નિષ્ફળ. યુઝરનેમ અને પાસવર્ડ તપાસો.' },
    'quick_login_role': { en: 'Quick fill demo account', hi: 'डेमो अकाउंट भरें', gu: 'ડેમો એકાઉન્ટ ભરો' },
    'login_select_role': { en: 'Select role', hi: 'भूमिका चुनें', gu: 'ભૂમિકા પસંદ કરો' },
    'role_admin': { en: 'Admin', hi: 'एडमिन', gu: 'એડમિન' },
    'role_supervisor': { en: 'Supervisor', hi: 'सुपरवाइज़र', gu: 'સુપરવાઇઝર' },
    'role_labour': { en: 'Labour', hi: 'मजदूर', gu: 'મજૂર' },
    'login_hint': { en: 'Demo: admin/admin123, rajesh/super123, amit/labour123', hi: 'डेमो: admin/admin123, rajesh/super123, amit/labour123', gu: 'ડેમો: admin/admin123, rajesh/super123, amit/labour123' },
    'logout': { en: 'Logout', hi: 'लॉग आउट', gu: 'લોગ આઉટ' },
    'logged_in_as': { en: 'Logged in as', hi: 'लॉग इन', gu: 'લોગ ઇન' },

    // Add Site
    'add_site': { en: 'Add Site', hi: 'नई साइट जोड़ें', gu: 'નવી સાઇટ ઉમેરો' },
    'site_location': { en: 'Location', hi: 'स्थान', gu: 'સ્થાન' },
    'site_budget': { en: 'Budget (₹)', hi: 'बजट (₹)', gu: 'બજેટ (₹)' },
    'site_supervisor': { en: 'Supervisor Name', hi: 'सुपरवाइज़र का नाम', gu: 'સુપરવાઇઝરનું નામ' },
    'add_site_validation': { en: 'Please fill all site fields correctly.', hi: 'कृपया सभी साइट विवरण सही भरें।', gu: 'કૃપા કરીને બધી સાઇટ વિગતો સાચી ભરો.' },

    // Sign up
    'signup_title': { en: 'Create Account', hi: 'खाता बनाएं', gu: 'એકાઉન્ટ બનાવો' },
    'signup_subtitle': { en: 'Supervisor or Labour registration', hi: 'सुपरवाइज़र या मजदूर पंजीकरण', gu: 'સુપરવાઇઝર અથવા મજૂર નોંધણી' },
    'signup_pending_site': { en: 'Admin will assign your site after registration.', hi: 'पंजीकरण के बाद एडमिन आपकी साइट असाइन करेगा।', gu: 'નોંધણી પછી એડમિન તમારી સાઇટ સોંપશે.' },
    'signup_success': { en: 'Account created. Login after admin assigns your site.', hi: 'खाता बन गया। एडमिन द्वारा साइट असाइन होने के बाद लॉगिन करें।', gu: 'એકાઉન્ટ બન્યું. એડમિન સાઇટ સોંપે પછી લોગિન કરો.' },
    'waiting_for_site': { en: 'Site not assigned yet', hi: 'साइट अभी असाइन नहीं हुई', gu: 'સાઇટ હજી સોંપાઈ નથી' },
    'waiting_for_site_desc': { en: 'Please contact admin. Your data will appear after a site is assigned to your account.', hi: 'एडमिन से संपर्क करें। साइट असाइन होने के बाद डेटा दिखेगा।', gu: 'એડમિનનો સંપર્ક કરો. સાઇટ સોંપાયા પછી ડેટા દેખાશે.' },
    'assign_users': { en: 'Assign Users', hi: 'यूज़र असाइन करें', gu: 'યુઝર સોંપો' },
    'select_user': { en: 'Select User', hi: 'यूज़र चुनें', gu: 'યુઝર પસંદ કરો' },
    'no_pending_users': { en: 'No users waiting for site assignment.', hi: 'साइट असाइन की प्रतीक्षा में कोई यूज़र नहीं।', gu: 'સાઇટ સોંપણીની રાહ જોતા કોઈ યુઝર નથી.' },
    'assign_site_success': { en: 'User assigned to site successfully.', hi: 'यूज़र को साइट असाइन हो गई।', gu: 'યુઝરને સાઇટ સોંપાઈ ગઈ.' },
    'create_account': { en: 'Sign Up', hi: 'साइन अप', gu: 'સાઇન અપ' },
    'signup_button': { en: 'Create Account', hi: 'खाता बनाएं', gu: 'એકાઉન્ટ બનાવો' },
    'creating_account': { en: 'Creating...', hi: 'बन रहा है...', gu: 'બનાવી રહ્યા છીએ...' },
    'signup_link': { en: 'Sign up', hi: 'साइन अप', gu: 'સાઇન અપ' },
    'no_account': { en: "Don't have an account?", hi: 'खाता नहीं है?', gu: 'એકાઉન્ટ નથી?' },
    'already_have_account': { en: 'Already have an account?', hi: 'पहले से खाता है?', gu: 'પહેલેથી એકાઉન્ટ છે?' },
    'admin_only_one': { en: 'Admin is pre-created (only one). You can register as Supervisor or Labour.', hi: 'एडमिन पहले से बना है (केवल एक)। आप सुपरवाइज़र या मजदूर के रूप में पंजीकरण कर सकते हैं।', gu: 'એડમિન પહેલેથી બનાવેલ છે (માત્ર એક). તમે સુપરવાઇઝર અથવા મજૂર તરીકે નોંધણી કરી શકો.' },
    'full_name': { en: 'Full Name', hi: 'पूरा नाम', gu: 'પૂરું નામ' },
    'account_role': { en: 'Account Role', hi: 'खाते की भूमिका', gu: 'એકાઉન્ટ ભૂમિકા' },
    'assign_site': { en: 'Assign to Site', hi: 'साइट चुनें', gu: 'સાઇટ પસંદ કરો' },
    'link_worker_profile': { en: 'Link Worker Profile', hi: 'मजदूर प्रोफ़ाइल लिंक करें', gu: 'મજૂર પ્રોફાઇલ લિંક કરો' },
    'confirm_password': { en: 'Confirm Password', hi: 'पासवर्ड की पुष्टि', gu: 'પાસવર્ડની પુષ્ટિ' },
    'signup_validation': { en: 'Please fill all required fields.', hi: 'कृपया सभी आवश्यक फ़ील्ड भरें।', gu: 'કૃપા કરીને બધી જરૂરી ફીલ્ડ ભરો.' },
    'password_min_length': { en: 'Password must be at least 6 characters.', hi: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए।', gu: 'પાસવર્ડ ઓછામાં ઓછા 6 અક્ષરનો હોવો જોઈએ.' },
    'password_mismatch': { en: 'Passwords do not match.', hi: 'पासवर्ड मेल नहीं खाते।', gu: 'પાસવર્ડ મેળ ખાતા નથી.' },
    'select_worker_required': { en: 'Please select a worker profile for labour account.', hi: 'मजदूर खाते के लिए worker profile चुनें।', gu: 'મજૂર એકાઉન્ટ માટે worker profile પસંદ કરો.' },
    'no_workers_for_site': { en: 'No workers on this site yet. Admin must add workers first.', hi: 'इस साइट पर अभी कोई मजदूर नहीं। पहले एडमिन मजदूर जोड़े।', gu: 'આ સાઇટ પર હજી મજૂર નથી. પહેલા એડમિન મજૂર ઉમેરે.' },
    'signup_failed': { en: 'Sign up failed. Please try again.', hi: 'साइन अप विफल। फिर कोशिश करें।', gu: 'સાઇન અપ નિષ્ફળ. ફરી પ્રયાસ કરો.' },
    'backend_offline': { en: 'Cannot connect to server. Start backend: cd backend && npm run start:dev', hi: 'सर्वर से कनेक्ट नहीं हो पा रहा। backend चालू करें।', gu: 'સર્વર સાથે કનેક્ટ થઈ શક્યું નથી. backend ચાલુ કરો.' },
  };

  // Translation Function
  public t(key: string): string {
    const translationSet = this.translations[key];
    if (!translationSet) {
      return key;
    }
    return translationSet[this.currentLanguage()] || translationSet['en'];
  }

  // Set Language
  public setLanguage(lang: SupportedLanguage) {
    this.currentLanguage.set(lang);
  }
}
