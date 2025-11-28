// components/CRM/LeadDetails/LeadFormTab.tsx
import React, { useState } from 'react';
import { 
  Save, 
  RefreshCw, 
  Edit3, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Globe, 
  BadgeInfo, 
  FileText, 
  Users, 
  TrendingUp,
  Tag,
  Target,
  Calendar,
  MessageSquare,
  BarChart3,
  Briefcase,
  Smartphone
} from 'lucide-react';
import { type Lead } from '@/utils/crm';
import { updateCachedLeadDetails } from '@/utils/crmCache';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface LeadFormTabProps {
  lead: Lead;
  leadId: string;
  employeeId: string;
  email: string;
  onLeadUpdate: (updatedLead: Lead) => void;
}

// Indian languages for the dropdown
const indianLanguages = [
  'Tamil', 'Hindi', 'English', 'Telugu', 'Kannada', 'Malayalam',
];

// Status options for the dropdown
const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'followup', label: 'Followup' },
  { value: 'Not Interested', label: 'Not Interested' },
  { value: 'Call Back', label: 'Call Back' },
  { value: 'Switch off', label: 'Switch off' },
  { value: 'RNR', label: 'RNR' },
];

// Profession options
const professionOptions = [
  'Business',
  'Student',
  'Professional',
  'Trader',
  'Investor',
  'Housewife',
  'Retired',
  'Other'
];

// Experience level options
const experienceOptions = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Professional'
];

// Medium options
const mediumOptions = [
  'Phone Call',
  'WhatsApp',
  'Email',
  'SMS',
  'In-Person',
  'Video Call'
];

// Demat account options
const dematAccountOptions = [
  '0_to_25',
  '26_to_50',
  '51_to_100',
  '100_plus'
];

// Status colors for display
const getStatusColor = (status: Lead['status']) => {
  const colors = {
    new: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    Contacted: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
    qualified: 'bg-green-100 text-green-800 hover:bg-green-100',
    followup: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    won: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
    'Not Interested': 'bg-red-100 text-red-800 hover:bg-red-100',
    'Call Back': 'bg-orange-100 text-orange-800 hover:bg-orange-100',
    'Switch off': 'bg-gray-100 text-gray-800 hover:bg-gray-100',
    'RNR': 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100'
  };
  return colors[status];
};

const LeadFormTab: React.FC<LeadFormTabProps> = ({ 
  lead, 
  leadId, 
  employeeId, 
  email, 
  onLeadUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Partial<Lead>>({});
  const [updating, setUpdating] = useState(false);

  // Function to update lead
  const updateLead = async () => {
    if (!leadId || !lead || updating) return;
    
    setUpdating(true);
    try {
      // Create a clean payload without any existing source field
      const { source: _, ...cleanEditedLead } = editedLead;
      
      const response = await fetch('https://n8n.gopocket.in/webhook/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'Update Lead',
          employeeId: employeeId,
          email: email,
          leadid: leadId,
          ...cleanEditedLead
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update lead: ${response.status}`);
      }

      // Update local state and cache
      const updatedLead = { ...lead, ...cleanEditedLead };
      onLeadUpdate(updatedLead);
      updateCachedLeadDetails(leadId, updatedLead);
      
      // Exit edit mode
      setIsEditing(false);
      setEditedLead({});
      
    } catch (error) {
      console.error('Error updating lead:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditedLead({});
    } else {
      // Start editing - initialize with current lead data
      setEditedLead(lead || {});
    }
    setIsEditing(!isEditing);
  };

  const handleFieldChange = (field: keyof Lead, value: any) => {
    setEditedLead(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateLead = () => {
    updateLead();
  };

  // Helper function to get display value
  const getDisplayValue = (value: any, fallback: string = 'Not specified') => {
    return value || fallback;
  };

  // Format currency for revenue targeting
  const formatRevenue = (revenue: string) => {
    if (!revenue) return 'Not specified';
    return `₹${revenue}`;
  };

  return (
    <div className="space-y-6">
      {/* Main Form Card */}
      <Card>
        <CardHeader className="bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Lead Information</CardTitle>
                <CardDescription>Manage lead details and preferences</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button 
                    onClick={handleUpdateLead}
                    disabled={updating}
                    className="flex bg-purple-600 hover:bg-purple-700 items-center gap-2"
                  >
                    {updating ? (
                      <>
                        <RefreshCw className="animate-spin h-4 w-4" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleEditToggle}
                    className="flex items-center gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleEditToggle}
                  className="flex bg-purple-600 hover:bg-purple-700 items-center gap-2"
                >
                  <Edit3 size={16} />
                  Edit Details
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Personal Information Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editedLead.name || lead.name || ''}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        placeholder="Enter full name"
                      />
                    ) : (
                      <div className="p-3 border rounded-md bg-muted/50">
                        {lead.name}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editedLead.email || lead.email || ''}
                          onChange={(e) => handleFieldChange('email', e.target.value)}
                          placeholder="Enter email"
                        />
                      ) : (
                        <div className="p-3 border rounded-md bg-muted/50 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {lead.email}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Mobile Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          type="tel"
                          value={editedLead.phone || lead.phone || ''}
                          onChange={(e) => handleFieldChange('phone', e.target.value)}
                          placeholder="Enter mobile number"
                        />
                      ) : (
                        <div className="p-3 border rounded-md bg-muted/50 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {lead.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      {isEditing ? (
                        <Select
                          value={editedLead.language || lead.language || ''}
                          onValueChange={(value) => handleFieldChange('language', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Language" />
                          </SelectTrigger>
                          <SelectContent>
                            {indianLanguages.map(language => (
                              <SelectItem key={language} value={language}>{language}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-3 border rounded-md bg-muted/50 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          {getDisplayValue(lead.language)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      {isEditing ? (
                        <Select
                          value={editedLead.status || lead.status || 'new'}
                          onValueChange={(value) => handleFieldChange('status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-3 border rounded-md bg-muted/50">
                          <Badge variant="secondary" className={getStatusColor(lead.status)}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Personal Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profession</Label>
                      {isEditing ? (
                        <Select
                          value={(editedLead as any).whats_your_profession || (lead as any).whats_your_profession || ''}
                          onValueChange={(value) => handleFieldChange('whats_your_profession' as any, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Profession" />
                          </SelectTrigger>
                          <SelectContent>
                            {professionOptions.map(profession => (
                              <SelectItem key={profession} value={profession}>{profession}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-3 border rounded-md bg-muted/50 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                          {getDisplayValue((lead as any).whats_your_profession)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      {isEditing ? (
                        <Select
                          value={(editedLead as any).gender || (lead as any).gender || ''}
                          onValueChange={(value) => handleFieldChange('gender' as any, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-3 border rounded-md bg-muted/50">
                          {getDisplayValue((lead as any).gender)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location & Documents Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Location & Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      {isEditing ? (
                        <Input
                          id="city"
                          value={editedLead.city || lead.city || ''}
                          onChange={(e) => handleFieldChange('city', e.target.value)}
                          placeholder="Enter city"
                        />
                      ) : (
                        <div className="p-3 border rounded-md bg-muted/50">
                          {getDisplayValue(lead.city)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      {isEditing ? (
                        <Input
                          id="state"
                          value={editedLead.state || lead.state || ''}
                          onChange={(e) => handleFieldChange('state', e.target.value)}
                          placeholder="Enter state"
                        />
                      ) : (
                        <div className="p-3 border rounded-md bg-muted/50">
                          {getDisplayValue(lead.state)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ucc">UCC Number</Label>
                      {isEditing ? (
                        <Input
                          id="ucc"
                          value={editedLead.ucc || lead.ucc || ''}
                          onChange={(e) => handleFieldChange('ucc', e.target.value)}
                          placeholder="Enter UCC number"
                        />
                      ) : (
                        <div className="p-3 border rounded-md bg-muted/50 flex items-center gap-2">
                          <BadgeInfo className="w-4 h-4 text-muted-foreground" />
                          {getDisplayValue(lead.ucc, 'Not available')}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="panNumber">PAN Number</Label>
                      {isEditing ? (
                        <Input
                          id="panNumber"
                          value={editedLead.panNumber || lead.panNumber || ''}
                          onChange={(e) => handleFieldChange('panNumber', e.target.value)}
                          placeholder="Enter PAN number"
                        />
                      ) : (
                        <div className="p-3 border rounded-md bg-muted/50 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          {getDisplayValue(lead.panNumber, 'Not available')}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Company & Source Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building className="w-4 h-4 text-primary" />
                    Source Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Form ID</Label>
                  <div className="p-3 border rounded-md bg-muted/50 font-mono text-sm">
                    {getDisplayValue((lead as any).form_id)}
                  </div>
                </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry/Lead Source</Label>
                    {isEditing ? (
                      <Input
                        id="industry"
                        value={editedLead.industry || lead.industry || ''}
                        onChange={(e) => handleFieldChange('industry', e.target.value)}
                        placeholder="Enter industry"
                      />
                    ) : (
                      <div className="p-3 border rounded-md bg-muted/50">
                        {lead.industry}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">Lead Value</Label>
                    {isEditing ? (
                      <Input
                        id="value"
                        type="number"
                        value={editedLead.value || lead.value || 0}
                        onChange={(e) => handleFieldChange('value', Number(e.target.value))}
                        placeholder="Enter lead value"
                      />
                    ) : (
                      <div className="p-3 border rounded-md bg-muted/50 font-bold text-lg text-green-600">
                        ₹{(lead.value || 0).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branchCode">Branch Code</Label>
                    {isEditing ? (
                      <Input
                        id="branchCode"
                        value={editedLead.branchCode || lead.branchCode || ''}
                        onChange={(e) => handleFieldChange('branchCode', e.target.value)}
                        placeholder="Enter branch code"
                      />
                    ) : (
                      <div className="p-3 border rounded-md bg-muted/50">
                        {getDisplayValue(lead.branchCode, 'Not available')}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaign">Campaign</Label>
                    {isEditing ? (
                      <Input
                        id="campaign"
                        value={editedLead.campaign || lead.campaign || ''}
                        onChange={(e) => handleFieldChange('campaign', e.target.value)}
                        placeholder="Enter campaign"
                      />
                    ) : (
                      <div className="p-3 border rounded-md bg-muted/50 flex items-center gap-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        {getDisplayValue(lead.campaign)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Trading & Business Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Trading & Business Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Trading Experience</Label>
                    {isEditing ? (
                      <Select
                        value={(editedLead as any).what_is_your_experience_level_in_trading || (lead as any).what_is_your_experience_level_in_trading || ''}
                        onValueChange={(value) => handleFieldChange('what_is_your_experience_level_in_trading' as any, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Experience Level" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceOptions.map(level => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-3 border rounded-md bg-muted/50">
                        {getDisplayValue((lead as any).what_is_your_experience_level_in_trading)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dematAccounts">Demat Accounts/Month</Label>
                    {isEditing ? (
                      <Select
                        value={(editedLead as any).how_many_demat_account_can_you_open_in_a_month || (lead as any).how_many_demat_account_can_you_open_in_a_month || ''}
                        onValueChange={(value) => handleFieldChange('how_many_demat_account_can_you_open_in_a_month' as any, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Range" />
                        </SelectTrigger>
                        <SelectContent>
                          {dematAccountOptions.map(option => (
                            <SelectItem key={option} value={option}>
                              {option.replace(/_/g, ' ').replace('to', ' to ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-3 border rounded-md bg-muted/50 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        {getDisplayValue((lead as any).how_many_demat_account_can_you_open_in_a_month?.replace(/_/g, ' ').replace('to', ' to '))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenueTarget">Monthly Revenue Target</Label>
                    {isEditing ? (
                      <Input
                        id="revenueTarget"
                        value={(editedLead as any).how_much_revenue_are_you_targeting_in_a_month || (lead as any).how_much_revenue_are_you_targeting_in_a_month || ''}
                        onChange={(e) => handleFieldChange('how_much_revenue_are_you_targeting_in_a_month' as any, e.target.value)}
                        placeholder="Enter revenue target"
                      />
                    ) : (
                      <div className="p-3 border rounded-md bg-muted/50 font-semibold text-green-600">
                        {formatRevenue((lead as any).how_much_revenue_are_you_targeting_in_a_month)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredMedium">Preferred Communication Medium</Label>
                    {isEditing ? (
                      <Select
                        value={(editedLead as any).what_is_your_preferred_medium_to_get_services_details || (lead as any).what_is_your_preferred_medium_to_get_services_details || ''}
                        onValueChange={(value) => handleFieldChange('what_is_your_preferred_medium_to_get_services_details' as any, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Medium" />
                        </SelectTrigger>
                        <SelectContent>
                          {mediumOptions.map(medium => (
                            <SelectItem key={medium} value={medium}>{medium}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-3 border rounded-md bg-muted/50 flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-muted-foreground" />
                        {getDisplayValue((lead as any).what_is_your_preferred_medium_to_get_services_details)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Additional Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="referredBy">Referred By</Label>
                  {isEditing ? (
                    <Input
                      id="referredBy"
                      value={editedLead.referredBy || lead.referredBy || ''}
                      onChange={(e) => handleFieldChange('referredBy', e.target.value)}
                      placeholder="Enter referrer name"
                    />
                  ) : (
                    <div className="p-3 border rounded-md bg-muted/50">
                      {getDisplayValue(lead.referredBy, 'Not referred')}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noOfEmployees">No. of Employees</Label>
                  {isEditing ? (
                    <Input
                      id="noOfEmployees"
                      type="number"
                      value={editedLead.noOfEmployees || lead.noOfEmployees || ''}
                      onChange={(e) => handleFieldChange('noOfEmployees', e.target.value)}
                      placeholder="Enter number of employees"
                    />
                  ) : (
                    <div className="p-3 border rounded-md bg-muted/50 flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {getDisplayValue(lead.noOfEmployees, 'Not specified')}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tradeDone">Trade Done</Label>
                  {isEditing ? (
                    <Input
                      id="tradeDone"
                      value={editedLead.tradeDone || lead.tradeDone || ''}
                      onChange={(e) => handleFieldChange('tradeDone', e.target.value)}
                      placeholder="Enter trade details"
                    />
                  ) : (
                    <div className="p-3 border rounded-md bg-muted/50 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      {getDisplayValue(lead.tradeDone, 'Not specified')}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherBrokers">Other Brokers</Label>
                  {isEditing ? (
                    <Input
                      id="otherBrokers"
                      value={editedLead.other_brokers || lead.other_brokers || ''}
                      onChange={(e) => handleFieldChange('other_brokers', e.target.value)}
                      placeholder="Enter other brokers"
                    />
                  ) : (
                    <div className="p-3 border rounded-md bg-muted/50">
                      {getDisplayValue(lead.other_brokers, 'None')}
                    </div>
                  )}
                </div>
              </div>

              {/* Trading Segments */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { key: 'nseCm', label: 'NSE CM' },
                  { key: 'nseCd', label: 'NSE CD' },
                  { key: 'bseFo', label: 'BSE FO' },
                  { key: 'mcxCo', label: 'MCX CO' },
                  { key: 'nseFo', label: 'NSE FO' },
                  { key: 'bseCm', label: 'BSE CM' }
                ].map((segment) => (
                  <div key={segment.key} className="space-y-2">
                    <Label>{segment.label}</Label>
                    <div className="p-2 border rounded-md bg-muted/50 text-center">
                      <Badge variant={lead[segment.key as keyof Lead] ? "default" : "outline"}>
                        {lead[segment.key as keyof Lead] ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Notes & Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedLead.notes || lead.notes || ''}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  rows={4}
                  placeholder="Add notes or issues about this lead..."
                />
              ) : (
                <div className="p-3 border rounded-md bg-muted/50 min-h-24 whitespace-pre-wrap">
                  {getDisplayValue(lead.notes, 'No notes available')}
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadFormTab;