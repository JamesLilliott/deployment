const cdk = require('@aws-cdk/core');
const ec2 = require('@aws-cdk/aws-ec2');
const iam = require('@aws-cdk/aws-iam');
const fs = require('fs');
// const KeyPair = require('cdk-ec2-key-pair');

class UtilitiesStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

      const vpc = this.createVpc();  
      const securityGroup = this.createSecurityGroup(vpc);
      const role = this.createIamRole();
      const ami = this.createAmi();
      // const key = this.createKeyPair();

      const instance = new ec2.Instance(this, 'utilities-instance-1', {
        instanceName: 'utilities-instance-1',
        // keyName: key.keyName,
        vpc: vpc,
        role: role,
        securityGroup: securityGroup,
        machineImage: ami,
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.T2,
          ec2.InstanceSize.MICRO
        ),
      });

      instance.addUserData(this.getUserData())
  }

  createVpc() {
    return new ec2.Vpc(this, 'utilities-vpc-1', {
      natGateways: 0,
      subnetConfiguration: [{
        name: 'public',
        subnetType: ec2.SubnetType.PUBLIC
      }]
    });
  };

  createSecurityGroup(vpc) {
    const securityGroup = new ec2.SecurityGroup(this, 'utilities-security-group-1', {
      vpc,
      description: 'VPC for utillities application',
      allowAllOutbound: true
    });

    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH access');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP access');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS access');

    return securityGroup;
  };

  createIamRole() {
    const role = new iam.Role(this, 'utilities-iam-role-1', {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
    });

    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));

    return role;
  };

  createAmi() {
    return new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
    })
  };
  
  createKeyPair() {
    const key = new KeyPair.KeyPair(this, 'utilities-instance-key-1', {
      name: 'utilities-instance-key-1',
      description: 'SSH key for utilities instance'
    });
    key.grantReadOnPublicKey

    return key;
  }

  getUserData() {
    return fs.readFileSync('./lib/user-data.sh', 'utf8');
  }

}

module.exports = { UtilitiesStack }
