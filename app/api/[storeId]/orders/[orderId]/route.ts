import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    if (!params.orderId) {
      return new NextResponse("Order id is required", { status: 400 });
    }

    const order = await prismadb.order.findUnique({
      where: {
        id: params.orderId
      }
    });
  
    return NextResponse.json(order);
  } catch (error) {
    console.log('[ORDER_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { orderId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.orderId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const order = await prismadb.order.findUnique({
        where: {
          id: params.orderId,
        },
        include: {
          orderItems: true, // Include the related orderItems
        },
    });

    if (!order) {
        // Handle the case where the order doesn't exist
        return new NextResponse("Order Not Found", { status: 500 });
        return;
    }

    await Promise.all(
        order.orderItems.map(async (orderItem) => {
          await prismadb.orderItem.delete({
            where: {
              id: orderItem.id,
            },
          });
        })
    );


    await prismadb.order.delete({
      where: {
        id: params.orderId
      }
    });
  
    return NextResponse.json(order);
  } catch (error) {
    console.log('[ORDER_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


// export async function PATCH(
//   req: Request,
//   { params }: { params: { orderId: string, storeId: string } }
// ) {
//   try {
//     const { userId } = auth();

//     const body = await req.json();

//     const { name, value } = body;

//     if (!userId) {
//       return new NextResponse("Unauthenticated", { status: 403 });
//     }

//     if (!name) {
//       return new NextResponse("Name is required", { status: 400 });
//     }

//     if (!value) {
//       return new NextResponse("Value is required", { status: 400 });
//     }


//     if (!params.orderId) {
//       return new NextResponse("Order id is required", { status: 400 });
//     }

//     const storeByUserId = await prismadb.store.findFirst({
//       where: {
//         id: params.storeId,
//         userId
//       }
//     });

//     if (!storeByUserId) {
//       return new NextResponse("Unauthorized", { status: 405 });
//     }

//     const order = await prismadb.order.update({
//       where: {
//         id: params.orderId
//       },
//       data: {
//         name,
//         value
//       }
//     });
  
//     return NextResponse.json(color);
//   } catch (error) {
//     console.log('[COLOR_PATCH]', error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// };
