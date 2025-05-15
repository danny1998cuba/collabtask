import { createServerClient } from '@/utils/supabase/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest, NextResponse } from 'next/server';

type WebhookEvent = {
    data: {
        id: string;
        first_name?: string;
        last_name?: string;
        name?: string;
        image_url?: string;
        email_addresses: Array<{
            email_address: string;
            verification: {
                status: string;
            };
        }>;
        primary_email_address_id?: string;
        public_metadata?: Record<string, unknown>;
        unsafe_metadata?: Record<string, unknown>;
        created_at: number;
        updated_at: number;
        // Organization data
        organization?: {
            id: string;
            name: string;
            created_at: number;
            updated_at: number;
        };
        // Public user data for org membership
        public_user_data?: {
            user_id: string;
            first_name?: string;
            last_name?: string;
            image_url?: string;
            email_address?: string;
        };
        role?: string;
    };
    object: 'event';
    type: 'organization.created' | 'organization.updated' |
    'organizationMembership.created' | 'organizationMembership.deleted' |
    'organizationMembership.updated' | 'user.created' | 'user.updated';
} | {
    data: {
        id: string;
        deleted: boolean;
    }
    object: 'event';
    type: 'organization.deleted' | 'user.deleted';
}

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req, { signingSecret: process.env.CLERK_WEBHOOK_SECRET })
        const event = evt as WebhookEvent
        const supabase = await createServerClient()

        switch (event.type) {
            case 'user.created': {
                // Handle user creation
                const { data: user, error } = await supabase
                    .from('users')
                    .insert([
                        {
                            id: event.data.id,
                            email: event.data.email_addresses[0].email_address,
                            first_name: event.data.first_name,
                            last_name: event.data.last_name,
                            avatar_url: event.data.image_url,
                            created_at: new Date(event.data.created_at).toISOString(),
                            updated_at: new Date(event.data.updated_at).toISOString(),
                        },
                    ])
                    .select()
                    .single()

                if (error) {
                    console.error('Error creating user:', error)
                    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
                }

                return new Response(JSON.stringify({ user }), { status: 200 })
            }

            case 'user.updated': {
                // Handle user update
                const { data: user, error } = await supabase
                    .from('users')
                    .update({
                        first_name: event.data.first_name,
                        last_name: event.data.last_name,
                        avatar_url: event.data.image_url,
                        updated_at: new Date(event.data.updated_at).toISOString(),
                    })
                    .eq('id', event.data.id)
                    .select()
                    .single()

                if (error) {
                    console.error('Error updating user:', error)
                    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
                }

                return new Response(JSON.stringify({ user }), { status: 200 })
            }

            case 'user.deleted': {
                // Handle user update
                if (event.data.deleted) {
                    const { data: user, error } = await supabase
                        .from('users')
                        .delete({ count: 'exact' })
                        .eq('id', event.data.id)
                        .select()
                        .single()

                    if (error) {
                        console.error('Error updating user:', error)
                        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
                    }

                    return new Response(JSON.stringify({ user }), { status: 200 })
                } else {
                    return new Response(JSON.stringify({ error: "Error deleting from Clerk" }), { status: 500 })
                }
            }

            case 'organization.created': {
                // Handle user update
                const { data, error } = await supabase
                    .from('organizations')
                    .insert([{
                        id: event.data.id,
                        name: event.data.name,
                        created_at: new Date(event.data.created_at).toISOString(),
                        updated_at: new Date(event.data.updated_at).toISOString(),
                    }])
                    .select()
                    .single()

                if (error) {
                    console.error('Error updating owner:', error)
                    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
                }

                return new Response(JSON.stringify({ data }), { status: 200 })
            }

            case 'organization.updated': {
                const { data, error } = await supabase
                    .from('organizations')
                    .update({
                        name: event.data.name,
                        updated_at: new Date(event.data.updated_at).toISOString(),
                    })
                    .eq('id', event.data.id)
                    .select()
                    .single()

                if (error) {
                    console.error('Error updating owner:', error)
                    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
                }

                return new Response(JSON.stringify({ data }), { status: 200 })
            }

            case 'organization.deleted': {
                // Handle user update
                if (event.data.deleted) {
                    const { data: user, error } = await supabase
                        .from('organizations')
                        .delete({ count: 'exact' })
                        .eq('id', event.data.id)
                        .select()
                        .single()

                    if (error) {
                        console.error('Error updating user:', error)
                        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
                    }

                    return new Response(JSON.stringify({ user }), { status: 200 })
                } else {
                    return new Response(JSON.stringify({ error: "Error deleting from Clerk" }), { status: 500 })
                }
            }

            case 'organizationMembership.created': {
                const { data, error } = await supabase
                    .from('organization_members')
                    .insert([{
                        organization_id: event.data.organization?.id,
                        user_id: event.data.public_user_data?.user_id,
                        role: event.data.role,
                        joined_at: new Date(event.data.created_at).toISOString(),
                        updated_at: new Date(event.data.updated_at).toISOString(),
                    }])
                    .select()
                    .single()

                if (error) {
                    console.error('Error updating member:', error)
                    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
                }

                return new Response(JSON.stringify({ data }), { status: 200 })
            }

            case 'organizationMembership.updated': {
                const { data, error } = await supabase
                    .from('organization_members')
                    .update({
                        user_id: event.data.public_user_data?.user_id,
                        organization_id: event.data.organization?.id,
                        updated_at: new Date(event.data.updated_at).toISOString(),
                    })
                    .eq('id', event.data.id)
                    .select()
                    .single()

                if (error) {
                    console.error('Error updating member:', error)
                    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
                }

                return new Response(JSON.stringify({ data }), { status: 200 })
            }


            case 'organizationMembership.deleted': {
                // Handle user update
                const { data: user, error } = await supabase
                    .from('organization_members')
                    .delete({ count: 'exact' })
                    .eq('id', event.data.id)
                    .select()
                    .single()

                if (error) {
                    console.error('Error updating user:', error)
                    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
                }

                return new Response(JSON.stringify({ user }), { status: 200 })
            }

            default: {
                console.log('Unhandled event type:', JSON.stringify(event, null, 2))
                return new Response(JSON.stringify({ success: true }), { status: 200 })
            }
        }
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new NextResponse('Error verifying webhook', { status: 400 })
    }
}