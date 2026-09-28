import 'package:flutter/material.dart';

void main() {
  runApp(const RSEARSApp());
}

class RSEARSApp extends StatelessWidget {
  const RSEARSApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'R-SEARS',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0B5ED7)),
        useMaterial3: true,
      ),
      home: const DriverDashboardScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class DriverDashboardScreen extends StatefulWidget {
  const DriverDashboardScreen({super.key});

  @override
  State<DriverDashboardScreen> createState() => _DriverDashboardScreenState();
}

class _DriverDashboardScreenState extends State<DriverDashboardScreen> {
  bool emergencyMode = false;
  int countdown = 15;

  void triggerSOS() {
    setState(() {
      emergencyMode = true;
      countdown = 15;
    });

    Future.doWhile(() async {
      if (!emergencyMode || countdown <= 0) {
        return false;
      }

      await Future.delayed(const Duration(seconds: 1));
      if (!mounted) return false;
      setState(() => countdown--);
      return true;
    }).then((_) {
      if (mounted && emergencyMode && countdown <= 0) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('SOS sent to police and nearest hospital')),
        );
      }
    });
  }

  void cancelSOS() {
    setState(() {
      emergencyMode = false;
      countdown = 15;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('R-SEARS Driver'),
        backgroundColor: const Color(0xFF0B5ED7),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Emergency response',
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),
            Card(
              child: ListTile(
                leading: const Icon(Icons.location_on, color: Color(0xFF0B5ED7)),
                title: const Text('Current GPS'),
                subtitle: const Text('-1.9434, 30.0607'),
              ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: triggerSOS,
                icon: const Icon(Icons.warning_amber_rounded),
                label: const Text('Trigger SOS'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFDC3545),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
            if (emergencyMode) ...[
              const SizedBox(height: 18),
              Card(
                color: const Color(0xFFFFF3CD),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      const Text('Countdown', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                      const SizedBox(height: 10),
                      Text(
                        '$countdown sec',
                        style: const TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFFDC3545),
                        ),
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: cancelSOS,
                        child: const Text('Cancel false alarm'),
                      )
                    ],
                  ),
                ),
              )
            ],
            const SizedBox(height: 18),
            Row(
              children: const [
                Expanded(
                  child: Card(
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: Text('Vehicle: Toyota Corolla'),
                    ),
                  ),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: Card(
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: Text('Blood group: A+'),
                    ),
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
