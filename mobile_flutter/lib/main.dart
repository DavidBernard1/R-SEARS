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
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: const Color(0xFFF5F9FF),
      ),
      home: const DriverHomeScreen(),
    );
  }
}

class DriverHomeScreen extends StatefulWidget {
  const DriverHomeScreen({super.key});

  @override
  State<DriverHomeScreen> createState() => _DriverHomeScreenState();
}

class _DriverHomeScreenState extends State<DriverHomeScreen> {
  int countdown = 15;
  bool emergencyMode = false;

  void triggerEmergency() {
    setState(() {
      emergencyMode = true;
      countdown = 15;
    });

    Future.doWhile(() async {
      if (!emergencyMode || countdown <= 0) return false;
      await Future.delayed(const Duration(seconds: 1));
      if (!mounted) return false;
      setState(() => countdown--);
      return true;
    }).then((_) {
      if (mounted && emergencyMode && countdown <= 0) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Emergency SOS sent to nearest police and hospital')),
        );
      }
    });
  }

  void cancelEmergency() {
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
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(18.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Road safety & emergency response',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              Card(
                child: ListTile(
                  leading: const Icon(Icons.location_on, color: Color(0xFF0B5ED7)),
                  title: const Text('Current location'),
                  subtitle: const Text('Kigali, Rwanda • Lat: -1.9434 • Lng: 30.0607'),
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: triggerEmergency,
                      icon: const Icon(Icons.warning_amber_rounded),
                      label: const Text('SOS Emergency'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFDC3545),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                    ),
                  ),
                ],
              ),
              if (emergencyMode) ...[
                const SizedBox(height: 20),
                Card(
                  color: const Color(0xFFFFF3CD),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        const Text(
                          'Emergency countdown',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '$countdown seconds',
                          style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFFDC3545)),
                        ),
                        const SizedBox(height: 12),
                        ElevatedButton(
                          onPressed: cancelEmergency,
                          child: const Text('Cancel false alarm'),
                        )
                      ],
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 20),
              const Row(
                children: [
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Vehicle', style: TextStyle(fontWeight: FontWeight.bold)),
                            SizedBox(height: 8),
                            Text('Toyota Corolla'),
                          ],
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Blood group', style: TextStyle(fontWeight: FontWeight.bold)),
                            SizedBox(height: 8),
                            Text('A+'),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
