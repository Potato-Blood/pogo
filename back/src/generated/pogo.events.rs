#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct KeyboardEvent {
    #[prost(enumeration = "PressRelease", tag = "1")]
    pub state: i32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MouseMoveEvent {
    #[prost(int64, tag = "1")]
    pub delta_x: i64,
    #[prost(int64, tag = "2")]
    pub delta_y: i64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MousePressEvent {
    #[prost(enumeration = "PressRelease", tag = "1")]
    pub state: i32,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MouseEvent {
    #[prost(oneof = "mouse_event::Event", tags = "1, 2")]
    pub event: ::core::option::Option<mouse_event::Event>,
}
/// Nested message and enum types in `MouseEvent`.
pub mod mouse_event {
    #[allow(clippy::derive_partial_eq_without_eq)]
    #[derive(Clone, PartialEq, ::prost::Oneof)]
    pub enum Event {
        #[prost(message, tag = "1")]
        MouseMoveEvent(super::MouseMoveEvent),
        #[prost(message, tag = "2")]
        MousePressEvent(super::MousePressEvent),
    }
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct VoiceEvent {
    #[prost(enumeration = "voice_event::VoiceEvent", tag = "1")]
    pub voice_event: i32,
}
/// Nested message and enum types in `VoiceEvent`.
pub mod voice_event {
    #[derive(
        Clone,
        Copy,
        Debug,
        PartialEq,
        Eq,
        Hash,
        PartialOrd,
        Ord,
        ::prost::Enumeration
    )]
    #[repr(i32)]
    pub enum VoiceEvent {
        On = 0,
        Off = 1,
    }
    impl VoiceEvent {
        /// String value of the enum field names used in the ProtoBuf definition.
        ///
        /// The values are not transformed in any way and thus are considered stable
        /// (if the ProtoBuf definition does not change) and safe for programmatic use.
        pub fn as_str_name(&self) -> &'static str {
            match self {
                VoiceEvent::On => "ON",
                VoiceEvent::Off => "OFF",
            }
        }
        /// Creates an enum from field names used in the ProtoBuf definition.
        pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
            match value {
                "ON" => Some(Self::On),
                "OFF" => Some(Self::Off),
                _ => None,
            }
        }
    }
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct HatEvent {}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Event {
    #[prost(oneof = "event::Event", tags = "1, 2, 3, 4")]
    pub event: ::core::option::Option<event::Event>,
}
/// Nested message and enum types in `Event`.
pub mod event {
    #[allow(clippy::derive_partial_eq_without_eq)]
    #[derive(Clone, PartialEq, ::prost::Oneof)]
    pub enum Event {
        #[prost(message, tag = "1")]
        KeyboardEvent(super::KeyboardEvent),
        #[prost(message, tag = "2")]
        MouseEvent(super::MouseEvent),
        #[prost(message, tag = "3")]
        VoiceEvent(super::VoiceEvent),
        #[prost(message, tag = "4")]
        HatEvent(super::HatEvent),
    }
}
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum PressRelease {
    Pressed = 0,
    Released = 1,
}
impl PressRelease {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            PressRelease::Pressed => "PRESSED",
            PressRelease::Released => "RELEASED",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "PRESSED" => Some(Self::Pressed),
            "RELEASED" => Some(Self::Released),
            _ => None,
        }
    }
}
