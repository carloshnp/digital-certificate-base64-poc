from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from datetime import datetime, timedelta
import uuid

# Generate a private key
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)

# Create a subject for the certificate
subject = x509.Name([
    x509.NameAttribute(NameOID.COMMON_NAME, "example.com"),
    x509.NameAttribute(NameOID.ORGANIZATION_NAME, "Example Organization"),
    x509.NameAttribute(NameOID.COUNTRY_NAME, "US"),
])

# Create a basic certificate
now = datetime.utcnow()
cert = x509.CertificateBuilder().subject_name(
    subject
).issuer_name(
    subject
).public_key(
    private_key.public_key()
).serial_number(
    int(uuid.uuid4())
).not_valid_before(
    now
).not_valid_after(
    now + timedelta(days=365)
).add_extension(
    x509.BasicConstraints(ca=True, path_length=None), critical=True,
).sign(private_key, hashes.SHA256())

# Save the certificate to a file
with open("certificate.pem", "wb") as f:
    f.write(cert.public_bytes(encoding=serialization.Encoding.PEM))

# Save the private key to a file
with open("private_key.pem", "wb") as f:
    f.write(private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    ))

print("Certificate and private key generated successfully.")
